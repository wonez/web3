import { Wallet } from "@solana/wallet-adapter-react";
import { FormEvent } from "react";
import { StreamflowSolana } from "@streamflow/stream";
import { SignerWalletAdapter } from "@solana/wallet-adapter-base";
import { client } from "../utils/constants.ts";
import { FormValues } from "../utils/interfaces.ts";
import { generateCreateStreamProps } from "../utils/helpers.ts";

interface IProps {
  tokenMint: string;
  decimals: number;
  wallet: Wallet;
}

const CreateStream = ({ tokenMint, decimals, wallet }: IProps) => {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData) as unknown as FormValues;

    const createStreamParams = generateCreateStreamProps(
      values,
      tokenMint,
      decimals,
    );

    const extParams: StreamflowSolana.ICreateStreamSolanaExt = {
      sender: wallet.adapter as SignerWalletAdapter,
    };

    try {
      await client.create(createStreamParams, extParams);
      alert("Stream created successfully!");
    } catch (err) {
      alert(err);
      console.dir(err);
    }
  };

  return (
    <div className={"my-5"}>
      <h3 className={"text-2xl mb-3"}>Create Stream</h3>
      <form onSubmit={handleSubmit}>
        <input
          className={
            "block mb-5 rounded-md w-1/3 py-2 px-3 text-gray-900 placeholder:text-gray-400 border-solid border-2 border-gray-400"
          }
          type="text"
          name="name"
          placeholder="Transaction name"
        />
        <input
          className={
            "block rounded-md mb-1 w-1/3 py-2 px-3 text-gray-900 placeholder:text-gray-400 border-solid border-2 border-gray-400"
          }
          type="text"
          name="recipient"
          placeholder="Recipient address"
        />
        <p className={"text-xs ml-2 text-gray-600"}>
          Example: F3cvWaJrZHJs2q47WiHzu5p7GCx5MT4FSuzGJijSeAQF
        </p>
        <input
          className={
            "block my-2 rounded-md w-1/3 py-2 px-3 text-gray-900 placeholder:text-gray-400 border-solid border-2 border-gray-400"
          }
          type="number"
          defaultValue={"0.00000001"}
          step="0.000000001"
          min={0}
          name="amount"
          placeholder="Amount"
        />
        <button
          className={"rounded w-1/3 bg-indigo-600 px-3 py-2 text-white mr-3"}
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateStream;
