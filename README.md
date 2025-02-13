# Cartesi Multi Outcome Prediction Market

## Index
- [Description](#description)
- [General Architecture](#general-arch)
- [Flow](#flow)
- [Screenshots](#screenshots)
- [Install Dependencies](#install-dependencies)
## Description

This project is a Multi-Outcome Prediction Market entirely on-chain, powered by Cartesi and EigenLayer. 

Calculating share prices for multiple outcomes using the LSMR formula is computationally intensive and costly on the blockchain. Cartesi's Coprocessor offloads these calculations:

Reduces Gas Costs: By handling complex computations off-chain.
Boosts Scalability: Enhances speed and efficiency of market operations.
Ensures Security: With on-chain verification of off-chain results.

This approach makes sophisticated prediction markets accessible, accurate, and versatile, leveraging Cartesi's technology for a better user experience.

## General Arch
![cartesi](https://github.com/user-attachments/assets/809fa84b-2e33-43e9-b95c-419598d7cfbd)
## Flow
![image](https://github.com/user-attachments/assets/100ad012-4139-4931-924d-14a31692fca8)
## Screenshots
<img width="996" alt="Screenshot 2025-02-13 alle 20 12 04" src="https://github.com/user-attachments/assets/008bbbd5-4fe2-4896-9762-d717b3cde98c" />
<img width="1114" alt="Screenshot 2025-02-13 alle 20 12 28" src="https://github.com/user-attachments/assets/97b9ed38-21b8-4bf1-ab84-abd539ebef10" />

## Install Dependencies
(need to install make first)

```bash
    make install-all
```

Built by [@fabriziogianni7](https://github.com/fabriziogianni7) and [@SolidityDrone](https://github.com/SolidityDrone/SolidityDrone)
