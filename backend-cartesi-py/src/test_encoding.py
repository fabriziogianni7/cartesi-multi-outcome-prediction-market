def encode_uint(x):
    return x.to_bytes(32, byteorder='big', signed=False)

def encode_int(x):
    return x.to_bytes(32, byteorder='big', signed=True)

def encode_notice_top(notice):
    finalPrice, requestId, updatedSharesList = notice
    dynamic_offset = 32 + 3 * 32  # 32+96 = 128 (0x80)
    head = encode_int(finalPrice) + encode_uint(requestId) + encode_uint(dynamic_offset)
    tail = encode_uint(len(updatedSharesList))
    for val in updatedSharesList:
        tail += encode_uint(val)
    return head + tail

def encode_notice_element_in_array(notice):
    finalPrice, requestId, updatedSharesList = notice
    dynamic_offset = 3 * 32  # 96 (0x60)
    head = encode_int(finalPrice) + encode_uint(requestId) + encode_uint(dynamic_offset)
    tail = encode_uint(len(updatedSharesList))
    for val in updatedSharesList:
        tail += encode_uint(val)
    return head + tail

def encode_notice_array(notice_list):
    # Use the per‐element function (which uses pointer 96) for array encoding.
    elements = [encode_notice_element_in_array(n) for n in notice_list]
    
    # Base for offset table is: (number of elements) * 32.
    base = len(notice_list) * 32
    offsets = []
    current = 0
    for e in elements:
        offsets.append(encode_uint(base + current))
        current += len(e)
    
    # Array encoding is: [ array length ] || [offset table] || [concatenated element encodings]
    return encode_uint(len(notice_list)) + b''.join(offsets) + b''.join(elements)

def main():
  
    notice = (-19, 88, [123, 321, 123, 321, 123, 321])
    notice_array = [notice, notice, notice, notice]  # Try 4 (or more) notices
    
    # For a top-level dynamic parameter such as Notice[], Solidity prepends an outer offset (32 bytes, value 32).
    outer = encode_uint(32)
    
    # Use our array encoding (which uses the per-element encoder for arrays).
    array_enc = encode_notice_array(notice_array)
    encoded = outer + array_enc
    print("Encoded Notice Array (hex):", encoded.hex())

if __name__ == '__main__':
    main()
    main()