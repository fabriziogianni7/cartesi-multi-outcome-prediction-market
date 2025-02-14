import math

def total_price_for_specific_outcome(q, b, outcome_index, n_shares):
    """
    Calculate the total price for buying n_shares of a specific outcome.
    
    Parameters:
    - q: list of quantities for each outcome [10,10,10]
    - b: liquidity parameter [100]
    - outcome_index: index of the outcome for which shares are being bought 0
    - n_shares: number of shares to buy for the specified outcome 6
    
    Returns:
    - Total price for buying nShares of the specified outcome
    """
    total_price = 0
    q_temp = list(q)  # Convert tuple to list
    
    for _ in range(n_shares):  # Loop nShares times
        # q_temp[outcome_index] += 1  # Increment shares for the specific outcome
        
        price_increase = lmsr_price(q_temp,b,outcome_index)
        q_temp[outcome_index] += 1
        total_price += price_increase

    return total_price
   
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
    q_new = list(q)
    q_new[outcome_index] += 1  # Add one share to the specified outcome
    return lmsr_cost(q_new, b) - lmsr_cost(q, b)
 

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
#         print(f"Probability of outcome {i}: {prob}")    print(f"Probability of outcome {i}: {prob}")
        