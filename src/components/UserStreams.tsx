import {useWallet} from "@solana/wallet-adapter-react";
import {PublicKey} from "@solana/web3.js";
import { useCallback, useEffect, useState} from "react";
import {
    IGetAllData,
    StreamType,
    StreamDirection,
    Stream
} from "@streamflow/stream";
import {client, INTERVAL} from "../utils/constants.ts";

const UserStreams = () => {
    const { publicKey} = useWallet();

    const [streams, setStreams] = useState<[string, Stream][] | []>([])

    const getUserStreams = useCallback(async () => {
        const data: IGetAllData = {
            address: (publicKey as PublicKey).toBase58(),
            type: StreamType.All,
            direction: StreamDirection.All,
        };

        try {
            setStreams((await client.get(data)));
        } catch (err) {
            console.log(err)
        }
    }, [publicKey])

    useEffect(() => {
        getUserStreams()
        const interval = setInterval(() => {
            getUserStreams()
        }, INTERVAL)

        return () => clearInterval(interval)
    }, [getUserStreams])

    return (
        <>
            <h3>User Streams</h3>
            {streams.length > 0 ? (
                <ul>
                    {streams.map(([metadataId, stream]) => (
                        <li key={metadataId}>{metadataId}: {stream.name}</li>
                    ))}
                </ul>
            ) : <p>No user streams found</p>}
        </>
    )
}

export default UserStreams;