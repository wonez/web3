import {useWallet, Wallet} from "@solana/wallet-adapter-react";

interface IProps {
    phantomWallet: Wallet;
}

const Toolbar = ({ phantomWallet }: IProps) => {
    const { select, publicKey, disconnect} = useWallet();

    return (
        <div>
            {!publicKey ? (
                <button onClick={() => select(phantomWallet.adapter.name)}>Connect</button>
            ) : (
                <>
                    <p>{publicKey.toBase58()}</p>
                    <button onClick={disconnect}>Disconnect</button>
                </>
            )}
        </div>
    )
}

export default Toolbar;