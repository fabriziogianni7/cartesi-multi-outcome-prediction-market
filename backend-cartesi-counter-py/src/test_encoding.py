def encode_uint(x):
    return x.to_bytes(32, byteorder='big', signed=False)

def encode_int(x):
    return x.to_bytes(32, byteorder='big', signed=True)

def encode_notice_top(notice):
    """
    Encode a single Notice struct as if it were encoded by abi.encode(notice).
    
    For a Notice defined as:
         struct Notice {
             int256 finalPrice;
             uint256 requestId;
             uint[] updatedSharesList;
         }
    the encoding (when used as a top‐level dynamic parameter) is:
       Head (3 words):
         • finalPrice (int256)
         • requestId  (uint256)
         • pointer to updatedSharesList, computed as:
               outer_offset (32) + 3*32 = 128 (0x80)
       Tail:
         • updatedSharesList.length (uint256)
         • each updatedSharesList element (uint256)
    Total length is 320 bytes when updatedSharesList has 6 items.
    """
    finalPrice, requestId, updatedSharesList = notice
    dynamic_offset = 32 + 3 * 32  # 32+96 = 128 (0x80)
    head = encode_int(finalPrice) + encode_uint(requestId) + encode_uint(dynamic_offset)
    tail = encode_uint(len(updatedSharesList))
    for val in updatedSharesList:
        tail += encode_uint(val)
    return head + tail

def encode_notice_element_in_array(notice):
    """
    Encode a single Notice struct for use as an element inside a dynamic array.
    
    Although the top‐level encoding (via abi.encode(notice)) would compute the
    dynamic pointer as 32 + 3*32 = 128 (0x80), when a Notice is in an array its
    own encoding is not preceded by an outer offset. Therefore the pointer here
    must be computed relative to the beginning of the element's encoding – that is,
         3 * 32 = 96 (0x60)
    
    The layout of the encoding is then:
       Head (3 words):
         • finalPrice (int256)
         • requestId  (uint256)
         • pointer to updatedSharesList = 96 (0x60)
       Tail:
         • updatedSharesList.length (uint256)
         • updatedSharesList elements (uint256)
    Total length remains 320 bytes.
    """
    finalPrice, requestId, updatedSharesList = notice
    dynamic_offset = 3 * 32  # 96 (0x60)
    head = encode_int(finalPrice) + encode_uint(requestId) + encode_uint(dynamic_offset)
    tail = encode_uint(len(updatedSharesList))
    for val in updatedSharesList:
        tail += encode_uint(val)
    return head + tail

def encode_notice_array(notice_list):
    """
    Encode a dynamic array of Notice elements exactly as Solidity's abi.encode(notices) does.
    
    The overall layout is:
       [ array length (uint256) ]
       [ offset for element 0 (uint256) ]
       [ offset for element 1 (uint256) ]
       [ ... ]
       [ concatenated encoded Notice element 0, element 1, ... ]
    
    IMPORTANT: The offsets are measured relative to the start of the _array tail_.
    When encoding an array of dynamic types the array header consists of:
         1 word for the length + (number of elements) words for the offsets.
    We must therefore compute the base for the offsets as:
         base = (number of elements) * 32
    and use our per-element encoding for array elements (which uses pointer = 96).
    
    For example, if there are 4 notices, base = 4*32 = 128.
    Then the offsets will be:
         element0: 128
         element1: 128 + 320 = 448   (0x1c0)
         element2: 128 + 640 = 768   (0x300)
         element3: 128 + 960 = 1088  (0x440)
    """
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
    # Example as in Solidity:
    #
    #   uint[] memory a = new uint[](6);
    #   a[0] = 123; a[1] = 321; a[2] = 123; a[3] = 321; a[4] = 123; a[5] = 321;
    #   Notice memory n = Notice(-19, 88, a);
    #
    #   Notice[] memory notices = new Notice[](N);
    #   For example, for N = 4:
    #       notices[0] = n; notices[1] = n; notices[2] = n; notices[3] = n;
    #   return abi.encode(notices);
    #
    # When a single Notice is encoded as a top-level parameter, the head contains a pointer of 0x80,
    # but for an element inside an array the per-element encoding should use pointer 0x60.
    # (That extra 32 bytes in the top-level case comes from the outer offset that wraps the whole parameter.)
    #
    # The expected encoding for a single Notice (top-level) is 320 bytes (with pointer 0x80 in its head)
    # and the final array encoding for, say, 4 notices is:
    #
    # Outer offset (for dynamic parameter) [word: 0x20] ||
    # Array encoding, which is:
    #   [ array length (uint256) ]
    #   [ offset for element 0 ]
    #   [ offset for element 1 ]
    #   [ offset for element 2 ]
    #   [ offset for element 3 ]
    #   [ encoded element 0 ] || [ encoded element 1 ] || [ encoded element 2 ] || [ encoded element 3 ]
    #
    # For the Notice tail, the first word must correctly be the number of updatedSharesList items (6).
    #
    # The following example uses 4 notices.
    
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