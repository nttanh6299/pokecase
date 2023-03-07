import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import { Collection, getCollection, getCollections } from "@/apis/collection";
import { Item } from "@/apis/item";
import Items from "@/modules/Home/Items";

const Home = () => {
  const [collections, setCollections] = useState<Collection[]>();

  const [fetching, setFetching] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection>();

  const onClickCollection = async (collection: Collection) => {
    if (collection.id === selectedCollection?.id) return;

    setFetching(true);
    const { data } = await getCollection(collection.id);
    const { items: collectionItems = [], ...fetchedCollection } = data;

    if (collectionItems?.length > 0) {
      setSelectedItems(collectionItems);
      setSelectedCollection(fetchedCollection);
    }

    setFetching(false);
  };

  const updateQuantityCollection = (quantity: number) => {
    if (selectedCollection.cost === 0) {
      return;
    }

    setSelectedCollection((prev) => {
      const prevQuantity = prev.quantity || 0;
      return {
        ...prev,
        quantity: prevQuantity + quantity <= 0 ? 0 : prevQuantity + quantity,
      };
    });
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
            key={collection.id}
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
      <Items
        collection={selectedCollection}
        items={selectedItems}
        updateQuantityCollection={updateQuantityCollection}
      />
    </div>
  );
};

export default Home;
