import { ethers } from 'ethers';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

// ABI 수정
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_ipfsHash",
        "type": "string"
      }
    ],
    "name": "addReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      }
    ],
    "name": "ReportAdded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getAllReports",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "",
        "type": "string[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const getEthereumContract = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            return contract;
        } catch (error) {
            console.error("Failed to connect to wallet:", error);
            throw new Error("지갑 연결에 실패했습니다.");
        }
    }
    throw new Error("MetaMask가 설치되어 있지 않습니다.");
};

export const saveIpfsHashToBlockchain = async (ipfsHash) => {
    try {
        const contract = await getEthereumContract();
        console.log("Sending transaction...");
        const tx = await contract.addReport(ipfsHash);
        console.log("Waiting for transaction confirmation...");
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        return receipt.transactionHash;
    } catch (error) {
        console.error('Blockchain save error:', error);
        throw error;
    }
}; 