import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { Coin } from "../utils/interfaces.ts";
import { DEVNET, initialCoinsState, INTERVAL } from "../utils/constants.ts";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { getOtherCoins } from "../utils/helpers.ts";

const connection = new Connection(clusterApiUrl(DEVNET), "confirmed");

const useCoins = () => {
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
    const otherCoins = await getOtherCoins(publicKey!, connection);

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

  return coins;
};

export default useCoins;
