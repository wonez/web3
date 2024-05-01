import { useWallet, Wallet } from "@solana/wallet-adapter-react";

interface IProps {
  phantomWallet: Wallet;
}

const Toolbar = ({ phantomWallet }: IProps) => {
  const { select, publicKey, disconnect } = useWallet();

  return (
    <div className={"my-5"}>
      {!publicKey ? (
        <button
          className={"rounded bg-indigo-600 px-3 py-2 text-white"}
          onClick={() => select(phantomWallet.adapter.name)}
        >
          Connect
        </button>
      ) : (
        <div className={"flex gap-5"}>
          <p className={"rounded p-3 bg-gray-100"}>{publicKey.toBase58()}</p>
          <button
            className={"rounded bg-red-600 px-3 text-white"}
            onClick={disconnect}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
