import { useCallback, useEffect, useState } from "react";
import {
  IGetAllData,
  Stream,
  StreamDirection,
  StreamType,
} from "@streamflow/stream";
import { PublicKey } from "@solana/web3.js";
import { client, INTERVAL } from "../utils/constants.ts";
import { useWallet } from "@solana/wallet-adapter-react";

const useUserStreams = () => {
  const { publicKey } = useWallet();

  const [streams, setStreams] = useState<[string, Stream][] | []>([]);

  const getUserStreams = useCallback(async () => {
    const data: IGetAllData = {
      address: (publicKey as PublicKey).toBase58(),
      type: StreamType.All,
      direction: StreamDirection.All,
    };

    try {
      setStreams(await client.get(data));
    } catch (err) {
      console.log(err);
    }
  }, [publicKey]);

  useEffect(() => {
    getUserStreams();
    const interval = setInterval(() => {
      getUserStreams();
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [getUserStreams]);

  return streams;
};

export default useUserStreams;
