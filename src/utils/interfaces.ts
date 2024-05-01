export interface Coin {
  mint: string;
  decimals: number;
  name: string;
  symbol: string;
  amount: number;
}

export interface FormValues {
  name: string;
  recipient: string;
  amount: string;
}
