import {useWallet} from "@solana/wallet-adapter-react";
import Toolbar from "../components/Toolbar.tsx";
import {useMemo, useState} from "react";
import Funds from "../components/Funds.tsx";
import CreateStream from "../components/CreateSteam.tsx";
import {Coin} from "../utils/interfaces.ts";
import UserStreams from "../components/UserStreams.tsx";
import {PHANTOM} from "../utils/constants.ts";

const Home = () => {
    const { wallets, publicKey} = useWallet();

    const [activeCoin, setActiveCoin] = useState<Coin | null>(null);

    const phantomWallet = useMemo(() => (
        wallets.find((wallet) => (wallet.adapter.name === PHANTOM))
    ),[wallets]);

    if(!phantomWallet) {
        return <h1>Phantom wallet not found.</h1>
    }

    return <div>
        <Toolbar phantomWallet={phantomWallet} />
        {publicKey && (
            <>
                <Funds setActiveCoin={setActiveCoin} />
                {activeCoin && <CreateStream tokenMint={activeCoin.mint} decimals={activeCoin.decimals} wallet={phantomWallet} />}
                <UserStreams />
            </>
        )}
    </div>
}

export default Home;