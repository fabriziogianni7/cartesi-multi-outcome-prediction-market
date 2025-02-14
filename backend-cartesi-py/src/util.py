
from eth_abi import encode,decode


def encode_abi_data(probabilities, outcome_index, total_price_for_specific_outcome):
    # Define the types according to the structure of your data
    types = ['uint256[]', 'uint256', 'uint256']
    # Encode the data
    
    print(f'probabilities',probabilities)
    print(f'outcome_index',outcome_index)
    print(f'total_price_for_specific_outcome',total_price_for_specific_outcome)
    
    encoded_data = encode(types, [probabilities, outcome_index, total_price_for_specific_outcome])
    # Return the hex string with '0x' prefix for consistency with most blockchain interactions
    return '0x' + encoded_data.hex()

def decode_abi_data(data):
    print(f"into decode_abi_data, data: ",data)
    types = ['uint256[]', 'uint256', 'uint256', 'uint256']
    decoded_data = decode(types, bytes.fromhex(data[2:]))
    print(f"decoded_data: ",decoded_data)
    return decoded_data