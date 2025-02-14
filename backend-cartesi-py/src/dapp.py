from os import environ
import logging
import requests
import json
import lsmr



logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")


def encode_uint(x):
    """Encode unsigned integer to 32 bytes"""
    if x < 0:
        raise ValueError(f"Cannot encode negative value {x} as uint")
    return x.to_bytes(32, byteorder='big', signed=False)

def encode_int(x):
    """Encode signed integer to 32 bytes"""
    return x.to_bytes(32, byteorder='big', signed=True)

def encode_notice_element_in_array(notice):
    finalPrice, requestId, updatedSharesList = notice
    dynamic_offset = 3 * 32  # 96
    head = encode_int(finalPrice) + encode_uint(requestId) + encode_uint(dynamic_offset)
    tail = encode_uint(len(updatedSharesList))
    for val in updatedSharesList:
        # Use encode_int instead of encode_uint for share values since they can be negative
        tail += encode_int(val)
    return head + tail

def encode_notice_array(notice_list):
    # Array encoding is: [ array length ] || [offset table] || [concatenated element encodings]
    elements = [encode_notice_element_in_array(n) for n in notice_list]
    base = len(notice_list) * 32
    offsets = []
    current = 0
    for e in elements:
        offsets.append(encode_uint(base + current))
        current += len(e)
    return encode_uint(len(notice_list)) + b''.join(offsets) + b''.join(elements)

def encode_notice_top(notice):
    finalPrice, requestId, updatedSharesList = notice
    dynamic_offset = 32 + 3 * 32  # 128
    head = encode_int(finalPrice) + encode_uint(requestId) + encode_uint(dynamic_offset)
    tail = encode_uint(len(updatedSharesList))
    for val in updatedSharesList:
        # Use encode_int instead of encode_uint for share values since they can be negative
        tail += encode_int(val)
    return head + tail
def encode_notice_element_in_array(notice):
    finalPrice, requestId, updatedSharesList = notice
    dynamic_offset = 3 * 32  # 96
    head = encode_int(finalPrice) + encode_uint(requestId) + encode_uint(dynamic_offset)
    tail = encode_uint(len(updatedSharesList))
    for val in updatedSharesList:
        tail += encode_uint(val)
    return head + tail

def encode_notice_array(notice_list):
    # Array encoding is: [ array length ] || [offset table] || [concatenated element encodings]
    elements = [encode_notice_element_in_array(n) for n in notice_list]
    base = len(notice_list) * 32
    offsets = []
    current = 0
    for e in elements:
        offsets.append(encode_uint(base + current))
        current += len(e)
    return encode_uint(len(notice_list)) + b''.join(offsets) + b''.join(elements)

def emit_notice(data):
    notice_payload = {"payload": data["payload"]}
    response = requests.post(rollup_server + "/notice", json=notice_payload)
    if response.status_code == 200 or response.status_code == 201:
        logger.info(f"Notice emitted successfully with data: {data}")
    else:
        logger.error(f"Failed to emit notice with data: {data}. Status code: {response.status_code}")

def handle_advance(data):
    logger.info(f"Received advance request data {data}")
    payload_hex = data['payload']

    try:
        # Decode and strip extra null characters and whitespace.
        payload_str = bytes.fromhex(payload_hex[2:]).decode('utf-8').strip('\x00 \n\r')
        print("Decoded payload:", payload_str)
        ids = []
        subarrays = []
        try:
            # Split the payload string into individual segments using the "],[" delimiter.
            array_parts = payload_str.split("],[")
            for part in array_parts:
                # Remove any surrounding brackets, whitespace, and nulls.
                part = part.strip("[] \x00\n\r")
                if not part:
                    continue  # Skip empty parts.
                # Split the segment by commas.
                elements = [elem.strip() for elem in part.split(',') if elem.strip()]
                if elements and elements[0].startswith("id:"):
                    # Extract the numerical id from the first element.
                    id_val = int(elements[0].split("id:")[1])
                    ids.append(id_val)
                    # Convert the remaining elements to integers for the subarray.
                    number_array = [int(num) for num in elements[1:]]
                    subarrays.append(number_array)
                else:
                    raise ValueError("Segment does not start with 'id:'")
            print("Extracted ids:", ids)
            print("Converted subarrays:", subarrays)
        except ValueError as error:
            ids = []
            subarrays = []
            print("Error parsing payload:", error)
    except Exception as e:
        print("Error decoding payload:", e)
        return "reject"

    # Use an if/else to determine whether to process the simulations.
    if len(subarrays) > 0:
        simulation_results = []
        final_updated_shares = []
        # Process each subarray similar to the example in lsmr.py main.
        for idx, q in enumerate(subarrays):
            print(f"\n--- Simulation for subarray {idx} (ID: {ids[idx] if idx < len(ids) else 'N/A'}) ---")
            b = 1000  # Arbitrary liquidity parameter
            print("Initial shares distribution:", q)
    
            # Calculate and print starting probabilities (each percentage)
            initial_probs = lsmr.lmsr_probability(q, b)
            print("Starting probabilities (in %):")
            for j, prob in enumerate(initial_probs):
                print(f"  Option {j}: {prob * 100:.2f}%")
            print("Total: {:.2f}%".format(sum(initial_probs) * 100))
    
            # Define a dummy transaction vector:
            shares_to_adjust = [1 if j % 2 == 0 else 0 for j in range(len(q))]
            print("\nShares to buy/sell per option:", shares_to_adjust)
    
            total_cost = 0.0
            current_shares = q.copy()
            remaining_to_adjust = shares_to_adjust.copy()
            cycle = 1
            # Process transactions one share per cycle.
            while any(adj != 0 for adj in remaining_to_adjust):
                print(f"\nCycle {cycle}:")
                for j in range(len(remaining_to_adjust)):
                    if remaining_to_adjust[j] > 0:  # Buying one share.
                        cost_before = lsmr.lmsr_cost(current_shares, b)
                        current_shares[j] += 1
                        remaining_to_adjust[j] -= 1
                        cost_after = lsmr.lmsr_cost(current_shares, b)
                        cost = cost_after - cost_before
                        total_cost += cost
                        print(f"  Option {j}: Bought 1 share at cost {cost:.4f}")
                    elif remaining_to_adjust[j] < 0:  # Selling one share.
                        cost_before = lsmr.lmsr_cost(current_shares, b)
                        current_shares[j] -= 1
                        remaining_to_adjust[j] += 1
                        cost_after = lsmr.lmsr_cost(current_shares, b)
                        cost = cost_after - cost_before
                        total_cost += cost
                        print(f"  Option {j}: Sold 1 share for refund {abs(cost):.4f}")
                cycle += 1
    
            print("\nFinal shares distribution after transactions:", current_shares)
            print("Net cost for transactions: {:.4f}".format(total_cost))
    
            updated_probs = lsmr.lmsr_probability(current_shares, b)
            print("\nUpdated probabilities (in %):")
            for j, prob in enumerate(updated_probs):
                print(f"  Option {j}: {prob * 100:.2f}%")
            print("Total: {:.2f}%".format(sum(updated_probs) * 100))
    
            print("\nInitial probabilities (solidity compatible, 6 decimals):")
            for j, prob in enumerate(initial_probs):
                solidity_value = int(round(prob * 1e6))
                print(f"  Option {j}: {solidity_value}   # represents {prob:.6f}")
            print("Total (solidity fixed 6 decimals):", int(round(sum(initial_probs) * 1e6)))
    
            print("\nUpdated probabilities (solidity compatible, 6 decimals):")
            for j, prob in enumerate(updated_probs):
                solidity_value = int(round(prob * 1e6))
                print(f"  Option {j}: {solidity_value}   # represents {prob:.6f}")
            print("Total (solidity fixed 6 decimals):", int(round(sum(updated_probs) * 1e6)))
    
            simulation_results.append({
                "id": ids[idx] if idx < len(ids) else None,
                "initial_shares": q,
                "final_shares": current_shares,
                "net_cost": total_cost,
                "initial_probabilities": initial_probs,
                "updated_probabilities": updated_probs,
            })
    
            final_updated_shares.append(current_shares)
    
        notices = []
        for sim in simulation_results:
            notice = (int(sim["net_cost"]), int(sim["id"]), sim["final_shares"])
            notices.append(notice)
    
        outer = encode_uint(32)
        array_enc = encode_notice_array(notices)
        encoded = outer + array_enc
        encoded_hex = encoded.hex()
    
        emit_notice({"payload": encoded_hex})
        return "accept"
    else:
        return "reject"

handlers = {
    "advance_state": handle_advance,
}


finish = {"status": "accept"}

while True:
    logger.info("Sending finish")
    response = requests.post(rollup_server + "/finish", json=finish)
    logger.info(f"Received finish status {response.status_code}")
    if response.status_code == 202:
        logger.info("No pending rollup request, trying again")
    else:
        rollup_request = response.json()
        data = rollup_request["data"]
        handler = handlers[rollup_request["request_type"]]
        finish["status"] = handler(rollup_request["data"])
        
