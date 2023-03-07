import { useEffect, useState } from "react";
import withAuth from "@/components/withAuth";
import { getItems, Item } from "@/apis/item";

const Inventory = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await getItems();
      setItems(data.data || []);
    };

    fetchItems();
  }, []);

  return <div>{JSON.stringify(items)}</div>;
};

export default withAuth(Inventory);
