from os import environ
import logging
import requests
import json

logging.basicConfig(level="INFO")
logger = logging.getLogger(__name__)

rollup_server = environ["ROLLUP_HTTP_SERVER_URL"]
logger.info(f"HTTP rollup_server url is {rollup_server}")

def emit_notice(data):
    notice_payload = {"payload": data["payload"]}
    response = requests.post(rollup_server + "/notice", json=notice_payload)
    if response.status_code == 201:
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
        if payload.get('method') == "increment" and 'counter' in payload:
            new_counter = payload['counter'] + 1
            print(f"Counter incremented to: {new_counter}")
            
            # Hex encode the counter value and pad to 32 bytes
            counter_hex = f"0x{new_counter:064x}"
            emit_notice({'payload': counter_hex})
            return "accept"
        
        else:
            print("Invalid method or missing counter value")
            return "reject"
    
    except Exception as error:
        print(f"Error processing payload: {error}")
        return "reject"


def handle_inspect(data):
    logger.info(f"Received inspect request data {data}")
    emit_notice(data)
    return "accept"


handlers = {
    "advance_state": handle_advance,
    "inspect_state": handle_inspect,
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
