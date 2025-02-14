
from eth_abi import encode,decode


def encode_abi_data(probabilities, outcome_index, total_price_for_specific_outcome):
    # Define the types according to the structure of your data
    types = ['uint256[]', 'uint256', 'uint256']
    # Encode the data
    
    print(f'probabilities',probabilities)
    print(f'outcome_index',outcome_index)
    print(f'total_price_for_specific_outcome',total_price_for_specific_outcome)
    
    # converting in base 6
    probabilities_converted = []
    for j, prob in enumerate(probabilities):
        solidity_value = int(round(prob * 1e6))
        print(f"solidity value", solidity_value)
       
        probabilities_converted.append(solidity_value)
        
    total_price_for_specific_outcome_converted = int(round(total_price_for_specific_outcome * 1e6))
                
    
    encoded_data = encode(types, [probabilities_converted, outcome_index, total_price_for_specific_outcome_converted])
    # Return the hex string with '0x' prefix for consistency with most blockchain interactions
    return '0x' + encoded_data.hex()

def decode_abi_data(data):
    print(f"into decode_abi_data, data: ",data)
    types = ['uint256[]', 'uint256', 'uint256', 'uint256']
    decoded_data = decode(types, bytes.fromhex(data[2:]))
    print(f"decoded_data: ",decoded_data)
    return decoded_data