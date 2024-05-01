import { Coin } from "../utils/interfaces.ts";
import useCoins from "../hooks/useCoins.ts";

interface IProps {
  setActiveCoin: (coin: Coin) => void;
  activeCoin: Coin | null;
}

const Funds = ({ setActiveCoin, activeCoin }: IProps) => {
  const coins = useCoins();

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
            {coin.name}: {coin.amount} {coin.symbol}
          </button>
        );
      })}
    </div>
  );
};

export default Funds;
