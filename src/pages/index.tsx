import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useWillChange } from "framer-motion";
import { Collection, getCollection, getCollections } from "@/apis/collection";
import { Item } from "@/apis/item";
import useAuth from "@/hooks/useAuth";

const drop = (items: Item[]) => {
  let chances = [];

  const sum = items.reduce((prev, curr) => prev + curr.chance, 0);

  let acc = 0;
  chances = items.map(({ chance }) => (acc = chance + acc));

  const rand = Math.random() * sum;

  const itemIndex = chances.filter((el) => el <= rand).length;

  const result = items.find((_, index) => index === itemIndex);

  return result!;
};

const generateSpinItems = (items: Item[]): Item[] => {
  let spinItems: Item[] = [];

  while (spinItems.length < 80) {
    spinItems.push(...items);
  }

  return shuffle(spinItems);
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

const Home = () => {
  const [collections, setCollections] = useState<Collection[]>();

  const [fetching, setFetching] = useState(false);
  const [items, setItems] = useState<Record<string, Item[]>>();
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection>();

  const onClickCollection = async (collection: Collection) => {
    if (items?.[collection.id]) {
      setSelectedItems(items[collection.id]);
      setSelectedCollection(collection);
      return;
    }

    setFetching(true);
    const { data } = await getCollection(collection.id);
    const collectionItems = data?.items;

    if (collectionItems) {
      setSelectedItems(data.items);
      setSelectedCollection(collection);
      setItems((prev) => ({ ...prev, [collection.id]: data.items }));
    }

    setFetching(false);
  };

  useEffect(() => {
    const fetchCollections = async () => {
      const { data } = await getCollections();
      setCollections(data.data || []);
    };

    fetchCollections();
  }, []);

  return (
    <div>
      <div className={styles.collections}>
        {collections?.map((collection) => (
          <div
            className={styles.collectionItem}
            style={{ opacity: fetching ? 0.25 : 1 }}
            onClick={() => onClickCollection(collection)}
          >
            <div className={styles.collectionImage}>
              <img src={collection.image} alt={collection.displayName} />
            </div>
            <div className={styles.collectionName}>
              {collection.displayName} - ${collection.cost}
            </div>
          </div>
        ))}
      </div>
      <Items collection={selectedCollection} items={selectedItems} />
    </div>
  );
};

interface ItemsProps {
  collection: Collection;
  items: Item[];
}

function Items({ collection, items = [] }: ItemsProps) {
  const x = useMotionValue(0);
  const willChange = useWillChange();

  const [selectedPokemon, setSelectedPokemon] = useState<Item>();
  const [spinItems, setSpinItems] = useState<Item[]>([]);
  const [spinning, setSpinning] = useState(false);

  const { user } = useAuth();
  const [error, setError] = useState("");

  const onClickOpen = () => {
    if (spinning || !items?.length) return;

    if (!user) {
      setError("You need to login first!");
      return;
    }

    if (user?.coin < collection?.cost) {
      setError("You don't have enough coins to buy!");
      return;
    }

    try {
      setSelectedPokemon(null);
      setSpinning(true);

      const selected = drop(items);

      const shuffleItems = generateSpinItems(items);

      const selectedIndex = 70;
      shuffleItems[selectedIndex] = selected;

      setSpinItems(shuffleItems);

      animate(x, random(-11990, -12130), {
        ease: [0.2, 0, 0.6, 1],
        duration: 1.2,
        onComplete: () => {
          setTimeout(() => {
            x.set(0);
            setSelectedPokemon(selected);
            setSpinning(false);
          }, 8500);
        },
      });
    } catch (error) {}
  };

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 8 }}>
        <button onClick={onClickOpen} style={{ opacity: spinning ? 0 : 1 }}>
          Open
        </button>
        {error && <div style={{ color: "var(--mythical)" }}>{error}</div>}
        {selectedPokemon && <div>You get: {selectedPokemon.name}</div>}
      </div>
      {items.map((item, index) => (
        <div key={item.id} className={styles.pokemon}>
          <div className={styles.image}>
            <img src={item.image} width="110px" height="100px" />
          </div>
          <div
            className={`${styles.text} ${styles[item.class] || styles.default}`}
          >
            {item.displayName} {index}
          </div>
        </div>
      ))}
      <div className={styles.list}>
        {spinning && (
          <div className={styles.holder}>
            <motion.div style={{ x, willChange }} className={styles.roller}>
              {spinItems.map((item, index) => (
                <div key={item.id} className={styles.pokemon}>
                  <div className={styles.image}>
                    <img src={item.image} width="180px" height="150px" />
                  </div>
                  <div
                    className={`${styles.text} ${
                      styles[item.class] || styles.default
                    }`}
                  >
                    {item.displayName} {index}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
