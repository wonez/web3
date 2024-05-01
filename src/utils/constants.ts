import { StreamflowSolana } from "@streamflow/stream";

export const DEVNET = "devnet";
export const SERUM_DEX = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
export const PHANTOM = "Phantom";
export const INTERVAL = 10000; // 10 seconds
export const initialCoinsState = [
  {
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
    name: "Solana",
    symbol: "SOL",
    amount: 0,
  },
];

export const client = new StreamflowSolana.SolanaStreamClient(
  "https://api.devnet.solana.com",
);
