import math

def total_price_for_specific_outcome(q, b, outcome_index, nShares):
    """
    Calculate the total price for buying nShares of a specific outcome.
    
    Parameters:
    - q: list of quantities for each outcome
    - b: liquidity parameter
    - outcome_index: index of the outcome for which shares are being bought
    - nShares: number of shares to buy for the specified outcome
    
    Returns:
    - Total price for buying nShares of the specified outcome
    """
    total_price = 0
    q_temp = q.copy()  # We work on a copy to not modify the original q
    
    for _ in range(nShares):  # Loop nShares times
        q_temp[outcome_index] += 1  # Increment shares for the specific outcome
        price_increase = lmsr_cost(q_temp, b) - lmsr_cost(q_temp.copy(), b)  # Price increase for one more share
        total_price += price_increase

    return total_price
    

def lmsr_cost(q, b):
        """
        Calculate the cost function for the Logarithmic Market Scoring Rule.
        
        Parameters:
        - q: list of quantities for each outcome
        - b: liquidity parameter
        
        Returns:
        - The cost of the current state of shares
        """
        sum_exp = sum(math.exp(qi / b) for qi in q)
        return b * math.log(sum_exp)

def lmsr_price(q, b, outcome_index):
    """
    Calculate the price for buying one more share of a specific outcome.
    
    Parameters:
    - q: list of quantities for each outcome
    - b: liquidity parameter
    - outcome_index: index of the outcome for which price is calculated
    
    Returns:
    - Price for an additional share of the specified outcome
    """
    q_new = q.copy()
    q_new[outcome_index] += 1  # Add one share to the specified outcome
    return lmsr_cost(q_new, b) - lmsr_cost(q, b)

def lmsr_probability(q, b):
    """
    Calculate the current probabilities of each outcome based on share quantities.
    
    Parameters:
    - q: list of quantities for each outcome
    - b: liquidity parameter
    
    Returns:
    - List of probabilities for each outcome
    """
    exp_q = [math.exp(qi / b) for qi in q]
    sum_exp = sum(exp_q)
    return [e / sum_exp for e in exp_q]
    
def main():
    # Liquidity parameter (adjust as needed)
    b = 100.0

    # Define initial shares distribution.
    initial_shares = [40, 10, 40]
    print("Initial shares distribution:", initial_shares)

    # Calculate starting probabilities (each probability multiplied by 100 will sum to 100%)
    initial_probs = lmsr_probability(initial_shares, b)
    print("Starting probabilities (in %):")
    for i, prob in enumerate(initial_probs):
        print(f"Option {i}: {prob * 100:.2f}%")
    print("Total: {:.2f}%".format(sum(initial_probs) * 100))
    
    # Define the number of shares to adjust for each outcome.
    # Positive numbers mean buying shares; negative numbers mean selling shares.
    shares_to_buy = [1, 0, 1]
    print("\nShares to buy/sell per option:", shares_to_buy)
    
    total_cost = 0.0
    current_shares = initial_shares.copy()
    # remaining_to_buy indicates how many adjustments remain 
    remaining_to_buy = shares_to_buy.copy()

    cycle = 1
    # Continue until all desired share adjustments (both buys and sells) are complete.
    while any(r != 0 for r in remaining_to_buy):
        print(f"\nCycle {cycle}:")
        for i in range(len(remaining_to_buy)):
            if remaining_to_buy[i] > 0:  # Buying one share.
                cost_before = lmsr_cost(current_shares, b)
                current_shares[i] += 1  # Buy one share.
                remaining_to_buy[i] -= 1
                cost_after = lmsr_cost(current_shares, b)
                cost = cost_after - cost_before  # Positive incremental cost.
                total_cost += cost
                print(f"  Option {i}: Bought 1 share at cost {cost:.4f}")
            elif remaining_to_buy[i] < 0:  # Selling one share.
                cost_before = lmsr_cost(current_shares, b)
                current_shares[i] -= 1  # Sell one share.
                remaining_to_buy[i] += 1  # Moving toward zero.
                cost_after = lmsr_cost(current_shares, b)
                cost = cost_after - cost_before  # Negative incremental cost (refund).
                total_cost += cost
                print(f"  Option {i}: Sold 1 share for refund {abs(cost):.4f}")
        cycle += 1

    print("\nFinal shares distribution after transactions:", current_shares)
    print("Net cost for transactions: {:.4f}".format(total_cost))
    
    # Calculate updated probabilities based on the new shares distribution.
    updated_probs = lmsr_probability(current_shares, b)
    print("\nUpdated probabilities (in %):")
    for i, prob in enumerate(updated_probs):
        print(f"Option {i}: {prob * 100:.2f}%")
    print("Total: {:.2f}%".format(sum(updated_probs) * 100))
    
    print("\nInitial probabilities (solidity compatible, 6 decimals):")
    for i, prob in enumerate(initial_probs):
        solidity_value = int(round(prob * 1e6))
        print(f"Option {i}: {solidity_value}   # represents {prob:.6f}")
    print("Total (solidity fixed 6 decimals):", int(round(sum(initial_probs) * 1e6)))
    
    print("\nUpdated probabilities (solidity compatible, 6 decimals):")
    for i, prob in enumerate(updated_probs):
        solidity_value = int(round(prob * 1e6))
        print(f"Option {i}: {solidity_value}   # represents {prob:.6f}")
    print("Total (solidity fixed 6 decimals):", int(round(sum(updated_probs) * 1e6)))


if __name__ == '__main__':
    main()

