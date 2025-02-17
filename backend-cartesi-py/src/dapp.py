from os import environ
import logging
import requests
import json
import lsmr
import util



logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

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
    print(f'data:', payload_hex)
    
    try:
        quantities, liquidity, outcome_index, n_shares, market_id, user_address = util.decode_abi_data(payload_hex)
        
        probabilities, total_price_for_specific_outcome = calculate_values(quantities, liquidity/1e6, outcome_index, n_shares)
        
        emit_notice({'payload': util.encode_abi_data(tuple(probabilities),outcome_index,total_price_for_specific_outcome,n_shares,market_id, user_address)})
        return "accept"
    
    except Exception as error:
        print(f"Error processing payload: {error}")
        return "reject"

def calculate_values(quantities, liquidity, outcome_index, n_shares):
    q = quantities
    b = liquidity
    
    
    
    total_price_for_specific_outcome = lsmr.total_price_for_specific_outcome(q,b,outcome_index,n_shares)
    market_cost = lsmr.lmsr_cost(q, b)
    one_share_cost = lsmr.lmsr_price(q, b, 0)
    
    updated_qs = quantities
    updated_qs[outcome_index] + n_shares
    updated_liquidity = b + total_price_for_specific_outcome
    
    
    probabilities = lsmr.lmsr_probability(updated_qs, updated_liquidity)
        
    print(f"Cost of current share distribution: {market_cost}")
    print(f"Price to buy one more share for outcome 0: {one_share_cost}")
    print(f"Probabilities",{tuple(probabilities)})
    return probabilities,total_price_for_specific_outcome

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
      