import styles from "@/styles/Home.module.css";
import { useRef, useState } from "react";
import { animate, motion, useMotionValue, useWillChange } from "framer-motion";
import { buyCollection, Collection, openCollection } from "@/apis/collection";
import { Item } from "@/apis/item";
import useAuth from "@/hooks/useAuth";
import { sellItems } from "@/apis/user";
import { round } from "@/utils";
import ItemComponent from "@/components/Item";

const generateSpinItems = (items: Item[]): Item[] => {
  let spinItems: Item[] = [];

  while (spinItems.length < 80) {
    spinItems.push(...items);
  }

  return shuffle(spinItems.filter((_, index) => index <= 80));
};

function random(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface ItemsProps {
  collection: Collection;
  items: Item[];
  updateQuantityCollection: (quantity: number) => void;
}

function Items({
  items = [],
  collection,
  updateQuantityCollection,
}: ItemsProps) {
  const x = useMotionValue(0);
  const willChange = useWillChange();

  const [selectedPokemon, setSelectedPokemon] = useState<Item>();
  const [spinItems, setSpinItems] = useState<Item[]>([]);
  const [quantity, setQuantity] = useState(1);

  const sellIdRef = useRef<string>("");
  const [selling, setSelling] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestBuy, setRequestBuy] = useState(false);

  const { user, setUser } = useAuth();
  const [error, setError] = useState("");

  const handleSave = () => {
    setSelectedPokemon(null);
    sellIdRef.current = "";
  };

  const handleSell = async () => {
    try {
      setSelling(true);
      const { data } = await sellItems([sellIdRef.current]);

      if (data > 0) {
        setUser((prev) => ({ ...prev, coin: round(prev.coin + data) }));
        setSelectedPokemon(null);
        sellIdRef.current = "";
      }
    } catch (error) {
      console.log("error", error);

      // Noted
      setError(error.data?.type);
    } finally {
      setSelling(false);
    }
  };

  const handleBuyCollection = async () => {
    if (spinning || !items?.length || quantity <= 0) return;

    if (!user) {
      setError("You need to login first!");
      return;
    }

    if (user.coin < collection.cost * quantity) {
      setError("You don't have enough coins to buy!");
      return;
    }

    try {
      setRequestBuy(true);
      const { data } = await buyCollection(collection.id, quantity);

      if (data > 0) {
        setError("");
        updateQuantityCollection(data);
        setQuantity(1);
        setUser((prev) => {
          const lastCoin = round(prev.coin - round(collection.cost * quantity));
          return {
            ...prev,
            coin: lastCoin >= 0 ? lastCoin : 0,
          };
        });
      }
    } catch (error) {
    } finally {
      setRequestBuy(false);
    }
  };

  const handleOpenCollection = async () => {
    if (spinning || !items?.length) return;

    if (!user) {
      setError("You need to login first!");
      return;
    }

    try {
      setRequestOpen(true);
      const { data } = await openCollection(collection.id);
      const { dropped, sellId, xp } = data ?? {};

      if (dropped) {
        updateQuantityCollection(-1);
        sellIdRef.current = sellId;
      }

      setSelectedPokemon(null);
      setSpinning(true);
      setError("");

      const shuffleItems = generateSpinItems(items);

      const selectedIndex = 70;
      shuffleItems[selectedIndex] = dropped;

      setSpinItems(shuffleItems);

      // NOTED: need to fixed "to" prop
      // random(-11990, -12130)
      animate(x, random(-11990, -12130), {
        ease: [0.2, 0, 0.6, 1],
        duration: 1.2,
        onComplete: () => {
          setTimeout(() => {
            x.set(0);
            setSelectedPokemon(dropped);
            setSpinning(false);
            setUser((prev) => ({ ...prev, xp: prev.xp + xp }));
          }, 8500);
        },
      });
    } catch (error) {
      console.log("error", error);

      // Noted
      setError(error.data?.type);
    } finally {
      setRequestOpen(false);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 8 }}>
        {collection && (
          <div style={{ display: "flex" }}>
            {(collection.cost === 0 || collection.quantity > 0) && (
              <button
                onClick={handleOpenCollection}
                disabled={requestBuy || requestOpen || spinning}
                style={{
                  marginRight: 4,
                }}
              >
                {`Open ${
                  collection?.quantity ? `(${collection.quantity})` : ""
                }`}
              </button>
            )}
            {collection?.cost !== 0 && (
              <>
                <button
                  onClick={handleBuyCollection}
                  disabled={requestBuy || requestOpen || spinning}
                >
                  Buy (${round(quantity * collection.cost)})
                </button>
                <div style={{ marginLeft: 4 }}>
                  <input
                    type="number"
                    placeholder="Quantity"
                    style={{ display: "inline-block", padding: 4 }}
                    value={quantity}
                    onChange={(e) => setQuantity(+e.target.value)}
                    min={1}
                  />
                </div>
              </>
            )}
          </div>
        )}
        {error && <div style={{ color: "var(--mythical)" }}>{error}</div>}
        {selectedPokemon && (
          <div style={{ display: "flex" }}>
            <div>You get: {selectedPokemon.name}</div>
            <button
              style={{
                color: "white",
                background: "var(--mythical)",
                display: "inline-block",
                padding: 4,
              }}
              onClick={handleSell}
              disabled={selling}
            >
              Sell ${selectedPokemon.cost}
            </button>
            <button
              style={{
                color: "white",
                background: "var(--common)",
                display: "inline-block",
                padding: 4,
              }}
              onClick={handleSave}
              disabled={selling}
            >
              Save
            </button>
          </div>
        )}
      </div>
      {items.map((item, index) => (
        <ItemComponent
          key={item.id}
          image={item.image}
          displayName={item.displayName}
          cost={item.cost}
          itemClass={item.class}
          index={index}
        />
      ))}
      <div className={styles.list}>
        {spinning && (
          <div className={styles.holder}>
            <motion.div style={{ x, willChange }} className={styles.roller}>
              {spinItems.map((item, index) => (
                <ItemComponent
                  key={index}
                  image={item.image}
                  displayName={item.displayName}
                  cost={item.cost}
                  itemClass={item.class}
                  index={index}
                  isSpinItem
                />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Items;
