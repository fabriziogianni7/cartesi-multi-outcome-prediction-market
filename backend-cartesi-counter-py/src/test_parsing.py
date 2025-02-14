def parse_payload(payload_str):
    print("Decoded payload:", payload_str)
    ids = []
    subarrays = []
    try:
        # Split the payload string into individual segments using the "],[" delimiter.
        array_parts = payload_str.split("],[")
        for part in array_parts:
            # Remove any surrounding brackets and whitespace from each segment.
            part = part.strip("[] ")
            if part:
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
    return ids, subarrays

def main():
    # Provided input string for testing.
    test_input = "[id:44,-2,3,3,2],[id:22,3,2,3,1],[id:45,-2,-1,4,-2,25,2]"
    # Convert the test input string to hex with a prefix "0x", simulating the expected payload_hex format.
    payload_hex = "0x" + test_input.encode('utf-8').hex()
    
    # The original logic strips the "0x" before decoding.
    payload_str = bytes.fromhex(payload_hex[2:]).decode('utf-8')
    
    # Run the parser.
    parse_payload(payload_str)

if __name__ == '__main__':
    main()

            