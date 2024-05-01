import { useCallback, useEffect, useState } from "react";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Coin } from "../utils/interfaces.ts";
import {
  DEVNET,
  initialCoinsState,
  INTERVAL,
  SERUM_DEX,
} from "../utils/constants.ts";

const connection = new Connection(clusterApiUrl(DEVNET), "confirmed");

interface IProps {
  setActiveCoin: (coin: Coin) => void;
  activeCoin: Coin | null;
}

const Funds = ({ setActiveCoin, activeCoin }: IProps) => {
  const { publicKey } = useWallet();

  const [coins, setCoins] = useState<Coin[]>([...initialCoinsState]);

  const getSOLBalance = useCallback(async () => {
    const solBalance =
      (await connection.getBalance(publicKey as PublicKey)) / LAMPORTS_PER_SOL;

    setCoins((prev) => {
      const newCoins = [...prev];
      const solIndex = newCoins.findIndex((coin) => coin.name === "Solana");
      newCoins[solIndex] = {
        ...newCoins[solIndex],
        amount: solBalance,
      };

      return newCoins;
    });
  }, [publicKey]);

  const getOtherCoinsBalance = useCallback(async () => {
    const res = await connection.getParsedTokenAccountsByOwner(
      publicKey as PublicKey,
      { programId: new PublicKey(SERUM_DEX) },
    );

    const otherCoins = await Promise.all(
      res.value.map(async (value) => {
        const mintAddress = new PublicKey(value.account.data.parsed.info.mint);

        const metaplex = Metaplex.make(connection);

        const metadataAccount = metaplex
          .nfts()
          .pdas()
          .metadata({ mint: mintAddress });

        const metadataAccountInfo =
          await connection.getAccountInfo(metadataAccount);

        if (metadataAccountInfo) {
          const token = await metaplex
            .nfts()
            .findByMint({ mintAddress: mintAddress });

          return {
            mint: mintAddress.toBase58(),
            name: token?.name,
            symbol: token?.symbol,
            decimals: value.account.data.parsed.info.tokenAmount?.decimals,
            amount: value.account.data.parsed.info.tokenAmount?.uiAmount,
          };
        }
      }),
    );

    setCoins((prev) => {
      const newCoins = [...prev];

      const validOtherCoins = otherCoins.filter(
        (coinInfo) => !!coinInfo,
      ) as Coin[];

      validOtherCoins.forEach((coin) => {
        const coinIndex = newCoins.findIndex((c) => c.name === coin.name);
        if (coinIndex === -1) {
          newCoins.push(coin);
        } else {
          newCoins[coinIndex] = coin;
        }
      });

      return newCoins;
    });
  }, [publicKey]);

  useEffect(() => {
    getSOLBalance();
    getOtherCoinsBalance();

    const interval = setInterval(() => {
      getSOLBalance();
      getOtherCoinsBalance();
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [getSOLBalance, getOtherCoinsBalance]);

  return (
    <div className={"my-5"}>
      <h3 className={"text-2xl mb-1"}>Select Coin to create Stream</h3>
      {coins.map((coin) => {
        return (
          <button
            className={`rounded bg-indigo-300 hover:bg-indigo-600 px-3 py-2 text-white mr-3 ${coin.name == activeCoin?.name && "!bg-indigo-600"}`}
            key={coin.name}
            disabled={coin.amount == 0}
            onClick={() => setActiveCoin(coin)}
          >
            {coin.name}: {coin.amount}
            {coin.symbol}
          </button>
        );
      })}
    </div>
  );
};

export default Funds;
