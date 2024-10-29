# Cyber Attack Report System with IPFS & Blockchain

A decentralized system for storing cyber attack analysis reports on IPFS and recording their hashes on the Ethereum blockchain (Sepolia testnet).

## Tech Stack

- Frontend: React.js
- Blockchain: Ethereum (Sepolia Testnet)
- Storage: IPFS (Infura)
- Smart Contract: Solidity
- Web3 Integration: ethers.js
- Styling: Tailwind CSS

## Key Features

- Create cyber attack analysis reports
- Distributed storage through IPFS
- Store IPFS hashes on Ethereum blockchain
- View stored reports

## Installation

1. Clone the repository

2. Install dependencies
    npm install

3. Set up environment variables
- Fill in the required values

4. Start development server
    npm start

## Environment Variables

The following environment variables are required:
    REACT_APP_INFURA_PROJECT_ID=your_infura_project_id
    REACT_APP_INFURA_API_SECRET=your_infura_api_secret
    REACT_APP_CONTRACT_ADDRESS=your_contract_address


## Smart Contract

### IpfsStorage.sol

solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
    contract IpfsStorage {

    string[] public ipfsHashes;
    event ReportAdded(string ipfsHash);

    function addReport(string memory ipfsHash) public {
    ipfsHashes.push(ipfsHash);
    emit ReportAdded(ipfsHash);
    }

    function getAllReports() public view returns (string[] memory) {
    return ipfsHashes;
    }
}


## Usage Guide

1. Install MetaMask and configure Sepolia testnet
2. Obtain Sepolia testnet ETH (https://sepoliafaucet.com/)
3. Create Infura account and set up IPFS project
4. Configure environment variables
5. Run the application

## Viewing IPFS Content

Stored IPFS content can be viewed through these gateways:
- https://ipfs.io/ipfs/[hash]
- https://gateway.pinata.cloud/ipfs/[hash]
- https://cloudflare-ipfs.com/ipfs/[hash]

## Verifying Blockchain Transactions

Check transactions on Sepolia Etherscan:
- https://sepolia.etherscan.io/tx/[transaction-hash]

## Development Notes

- IPFS upload size limit: 50MB
- Uses Sepolia testnet
- Environment variables must start with 'REACT_APP_'

## Security Considerations

- Never commit `.env` file to GitHub
- Keep API keys and secrets secure
- Additional security measures required for production environment

## License

MIT License

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- IPFS
- Ethereum
- Infura
- OpenZeppelin
- React community