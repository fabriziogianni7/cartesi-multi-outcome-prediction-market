from os import environ
import logging
import requests
import json
import numpy as np


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
    
    try:
        payload_str = bytes.fromhex(payload_hex[2:]).decode('utf-8')
        payload = json.loads(payload_str)
        print("Payload:", payload)

        # Check if the method is increment and counter value exists
        # { 
        #   method: 'example', 
        #   shares: [10, 10, 10],
        #   liquidity: 100.0 
        #  } 
        if payload.get('method') == "example" and 'shares' in payload and 'liquidity' in payload :
            # new_counter = payload['counter'] + 1
            # print(f"Counter incremented to: {new_counter}")
            print(f"Sares: {payload['shares']}")
            print(f"Liquidity: {payload['liquidity']}")
            
            # Example with 3 outcomes, initial shares, and liquidity parameter
            # q = [10, 10, 10]  # Shares for each outcome, initially equal
            # b = 100.0  # Liquidity parameter
            q = payload['shares']
            b = payload['liquidity']
            
            print(f"Cost of current share distribution: {lmsr_cost(q, b)}")
            
            # Price to buy one more share for outcome 0
            print(f"Price to buy one more share for outcome 0: {lmsr_price(q, b, 0)}")
            
            # Probabilities of each outcome
            probabilities = lmsr_probability(q, b)
            print(f"Probabilities",{probabilities})
            
            for i, prob in enumerate(probabilities):
                print(f"Probability of outcome {i}: {prob}")
        
            
            # Hex encode the counter value and pad to 32 bytes
            # counter_hex = f"0x{new_counter:064x}"
            emit_notice({'payload': probabilities})
            return "accept"
        
        else:
            print("Invalid method or missing counter value")
            return "reject"
    
    except Exception as error:
        print(f"Error processing payload: {error}")
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
        

    def lmsr_cost(q, b):
        """
        Calculate the cost function for the Logarithmic Market Scoring Rule.
        
        Parameters:
        - q: list or numpy array of quantities for each outcome
        - b: liquidity parameter
        
        Returns:
        - The cost of the current state of shares
        """
        return b * np.log(np.sum(np.exp(np.array(q) / b)))

    def lmsr_price(q, b, outcome_index):
        """
        (we should loop that for all the share we wanna buy)
        Calculate the price for buying one more share of a specific outcome.
        
        Parameters:
        - q: list or numpy array of quantities for each outcome
        - b: liquidity parameter
        - outcome_index: index of the outcome for which price is calculated
        
        Returns:
        - Price for an additional share of the specified outcome
        """
        q = np.array(q)
        q_new = q.copy()
        q_new[outcome_index] += 1  # Add one share to the specified outcome
        return lmsr_cost(q_new, b) - lmsr_cost(q, b)

    def lmsr_probability(q, b):
        """
        Calculate the current probabilities of each outcome based on share quantities.
        
        Parameters:
        - q: list or numpy array of quantities for each outcome
        - b: liquidity parameter
        
        Returns:
        - List of probabilities for each outcome
        """
        exp_q = np.exp(np.array(q) / b)
        return exp_q / np.sum(exp_q)

# Example usage:
# if __name__ == "__main__":
#     # Example with 3 outcomes, initial shares, and liquidity parameter
#     q = [10, 10, 10]  # Shares for each outcome, initially equal
#     b = 100.0  # Liquidity parameter
    
#     print(f"Cost of current share distribution: {lmsr_cost(q, b)}")
    
#     # Price to buy one more share for outcome 0
#     print(f"Price to buy one more share for outcome 0: {lmsr_price(q, b, 0)}")
    
#     # Probabilities of each outcome
#     probabilities = lmsr_probability(q, b)
#     for i, prob in enumerate(probabilities):
#         print(f"Probability of outcome {i}: {prob}")
        