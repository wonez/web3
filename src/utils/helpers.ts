import { Connection, PublicKey } from "@solana/web3.js";
import { SERUM_DEX } from "./constants.ts";
import { Metaplex } from "@metaplex-foundation/js";
import { getBN, ICreateStreamData } from "@streamflow/stream";
import { BN } from "bn.js";
import { FormValues } from "./interfaces.ts";

export const getOtherCoins = async (
  publicKey: PublicKey,
  connection: Connection,
) => {
  const res = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: new PublicKey(SERUM_DEX),
  });

  return await Promise.all(
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
};

export const generateCreateStreamProps = (
  { recipient, amount, name }: FormValues,
  tokenId: string,
  decimals: number,
): ICreateStreamData => {
  return {
    recipient,
    name,
    tokenId,
    start: 0,
    amount: getBN(parseFloat(amount), decimals),
    period: 1,
    cliff: 0,
    cliffAmount: new BN(0, 2),
    amountPerPeriod: getBN(parseFloat(amount), decimals),
    canTopup: true,
    cancelableBySender: true,
    cancelableByRecipient: false,
    transferableBySender: true,
    transferableByRecipient: false,
    automaticWithdrawal: true,
    withdrawalFrequency: 1,
  };
};
