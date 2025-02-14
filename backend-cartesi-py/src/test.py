import lsmr
import util

def calculate_values(quantities, liquidity, outcome_index, n_shares):
    q = quantities
    b = liquidity
    market_cost = lsmr.lmsr_cost(q, b)
    one_share_cost = lsmr.lmsr_price(q, b, 0)
    probabilities = lsmr.lmsr_probability(q, b)
    total_price_for_specific_outcome = lsmr.total_price_for_specific_outcome(q,b,outcome_index,n_shares)
        
    print(f"Cost of current share distribution: {market_cost}")
    print(f"Price to buy one more share for outcome 0: {one_share_cost}")
    print(f"Probabilities",{tuple(probabilities)})
    return probabilities,total_price_for_specific_outcome

def convert_probabilities(probabilities):
    probabilities_converted = []
    for j, prob in enumerate(probabilities):
        solidity_value = int(round(prob * 1e6))
        print(f"solidity value", solidity_value)
       
        probabilities_converted.append(solidity_value)

def test_total_price_for_specific_outcome(q, b, outcome_index, n_shares):
    print(lsmr.total_price_for_specific_outcome(q, b, outcome_index, n_shares))

# test_total_price_for_specific_outcome((10, 10, 10), 100, 1, 6)

# print(f"result: ",calculate_values((10,10,10),100,0,5))
# print(f"result: ",convert_probabilities( (0.3333333333333333, 0.3333333333333333, 0.3333333333333333)))

util.decode_abi_data("0x0faa984500000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000006400000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000100000000000000000000000039806bdcbd704970000bd6db4874d6e98cf151230000000000000000000000000000000000000000000000000000000000000003000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000a")
