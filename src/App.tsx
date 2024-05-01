import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import Home from "./pages/Home.tsx";
import { DEVNET } from "./utils/constants.ts";

const App = () => {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  const endpoint = useMemo(() => clusterApiUrl(DEVNET), []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <Home />
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
