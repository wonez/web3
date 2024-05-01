import useUserStreams from "../hooks/useUserStreams.ts";

const UserStreams = () => {
  const streams = useUserStreams();

  return (
    <>
      <h3 className={"text-2xl mb-2"}>User Streams</h3>
      {streams.length > 0 ? (
        <ul>
          {streams.map(([metadataId, stream]) => (
            <li className={"mb-1"} key={metadataId}>
              <b>{stream.name}</b>:{" "}
              <span className={"text-sm text-gray-600"}>{metadataId}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={"text-md"}>No user streams found</p>
      )}
    </>
  );
};

export default UserStreams;
