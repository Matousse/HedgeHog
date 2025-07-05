export const OPTION_CONTRACT_ADDRESS = "0xC0915573ceCE1E73F5E15A0749875603fbb63746" as const;

// Standard ERC20 ABI for token interactions
export const ERC20_ABI = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      { "name": "owner", "type": "address" },
      { "name": "spender", "type": "address" }
    ],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{ "name": "account", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  }
] as const;

export const OPTION_CONTRACT_ABI = [
  {
    "type": "function",
    "name": "createPutOpt",
    "inputs": [
      { "name": "strike", "type": "uint256" },
      { "name": "premium", "type": "uint256" },
      { "name": "expiry", "type": "uint256" },
      { "name": "asset", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "usdc",
    "inputs": [],
    "outputs": [ { "name": "", "type": "address" } ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "optCount",
    "inputs": [],
    "outputs": [ { "name": "", "type": "uint256" } ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "opts",
    "inputs": [ { "name": "", "type": "uint256" } ],
    "outputs": [
      { "name": "strike", "type": "uint256" },
      { "name": "premium", "type": "uint256" },
      { "name": "amount", "type": "uint256" },
      { "name": "expiry", "type": "uint256" },
      { "name": "seller", "type": "address" },
      { "name": "buyer", "type": "address" },
      { "name": "asset", "type": "address" },
      { "name": "assetSent", "type": "bool" },
      { "name": "fundSent", "type": "bool" }
    ],
    "stateMutability": "view"
  }
] as const;
