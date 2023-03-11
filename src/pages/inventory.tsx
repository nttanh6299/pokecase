import { useEffect, useState, useCallback } from "react";
import withAuth from "@/components/withAuth";
import { getItems, Item } from "@/apis/item";
import { ITEM_CLASSES, SORT_OPTIONS } from "@/constants/common";
import styles from "@/styles/Inventory.module.css";
import useFilter, { allOption } from "@/hooks/useFilter";
import SearchInput from "@/modules/Inventory/SearchInput";
import SelectableItem from "@/modules/Inventory/SelectableItem";
import { round } from "@/utils";
import { sellItems } from "@/apis/user";
import useAuth from "@/hooks/useAuth";

enum FilterName {
  Classes = "classes",
  Sort = "sort",
}

enum SortDirection {
  Desc = "desc",
  Asc = "asc",
}

const Inventory = () => {
  const [items, setItems] = useState<Item[]>([]);
  const {
    filters,
    sortBy,
    sortDirection,
    keyword,
    addFilters,
    addSortBy,
    addSortDirection,
    addKeyword,
    checkFilterChecked,
    hasFilterValues,
    clearAllFilters,
  } = useFilter({
    defaultSortBy: "cost",
    defaultSortDirection: SortDirection.Desc,
  });

  const { setUser } = useAuth();

  const [error, setError] = useState("");
  const [selling, setSelling] = useState(false);
  const [selectable, setSelectable] = useState(false);
  const [selectedItemIds, setSelectedItemIds] =
    useState<Record<string, number>>();

  const fetchItems = useCallback(async () => {
    const filterParams: Parameters<typeof getItems>[0] = {
      search: keyword?.trim() || undefined,
      sort: {
        direction: sortDirection || (sortBy ? SortDirection.Asc : undefined),
        type: sortBy,
      },
      filters: filters?.reduce(
        (acc, filter) => ({
          ...acc,
          [filter.slug]: filter.values,
        }),
        {}
      ),
    };
    const { data } = await getItems(filterParams);
    const fetchedItems = data.data || [];
    setItems(fetchedItems);
  }, [filters, sortBy, sortDirection, keyword]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSelectItem = (sellId: string, cost: number) => {
    const selected = { ...selectedItemIds };

    if (selected?.[sellId]) {
      delete selected[sellId];
      setSelectedItemIds(selected);
      return;
    }

    setSelectedItemIds({ ...selected, [sellId]: cost });
  };

  const handleClearSelectItem = () => {
    setSelectedItemIds({});
  };

  const handleExchange = async () => {
    try {
      setSelling(true);

      const ids = Object.keys(selectedItemIds);
      const { data } = await sellItems(ids);

      if (data > 0) {
        setUser((prev) => ({ ...prev, coin: round(prev.coin + data) }));
        setSelectedItemIds({});
        fetchItems();
      }
    } catch (error) {
      console.log("error", error);

      // Noted
      setError(error.data?.type);
    } finally {
      setSelling(false);
    }
  };

  const canExchange = Object.keys(selectedItemIds ?? {}).length > 0;
  const totalCost = round(
    Object.values(selectedItemIds ?? {}).reduce((acc, cost) => acc + cost, 0)
  );

  return (
    <div>
      <div style={{ marginTop: "8px" }}>
        <SearchInput defaultValue={keyword} setValue={addKeyword} />
      </div>
      <div style={{ marginTop: "8px" }}>
        <button onClick={() => clearAllFilters(true)}>Clear all</button>
      </div>
      <div style={{ display: "flex" }}>
        <div className={styles.item}>Sort: </div>
        <div className={styles.item}>
          <button
            onClick={() =>
              addSortDirection(
                sortDirection === SortDirection.Desc
                  ? SortDirection.Asc
                  : SortDirection.Desc
              )
            }
          >
            {sortDirection === SortDirection.Desc ? "Ascending" : "Descending"}
          </button>
        </div>
        {SORT_OPTIONS.map((option) => (
          <div className={styles.item} key={option.value}>
            <label htmlFor={option.value}>
              <input
                type="radio"
                id={option.value}
                name={FilterName.Sort}
                checked={sortBy === option.value}
                onChange={() => addSortBy(option.value)}
              />
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        {[allOption, ...ITEM_CLASSES].map((option) => {
          const isChecked = checkFilterChecked(
            FilterName.Classes,
            option.value
          );
          const hasValues = hasFilterValues(FilterName.Classes);
          const isAllOption = option.value === allOption.value;
          const isAllChecked = !hasValues && isAllOption;

          return (
            <div className={styles.item} key={option.value}>
              <label htmlFor={option.value}>
                <input
                  type="radio"
                  id={option.value}
                  name={FilterName.Classes}
                  checked={isChecked || isAllChecked}
                  onChange={() =>
                    addFilters(
                      FilterName.Classes,
                      isAllOption ? [] : [option.value]
                    )
                  }
                />
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex" }}>
        <label htmlFor="selectable">
          <input
            type="checkbox"
            id="selectable"
            checked={selectable}
            onChange={(e) => setSelectable(e.target.checked)}
          />
          Select
        </label>
        {canExchange && (
          <>
            <div style={{ marginLeft: "8px" }}>
              <button onClick={handleClearSelectItem} disabled={selling}>
                Clear all
              </button>
            </div>
            <div style={{ marginLeft: "8px" }}>
              <button onClick={handleExchange} disabled={selling}>
                Exchange for {totalCost} coins
              </button>
            </div>
          </>
        )}
      </div>
      {error && <div style={{ color: "var(--mythical)" }}>{error}</div>}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {items?.map((item, index) => (
          <SelectableItem
            key={index}
            image={item.image}
            displayName={item.displayName}
            cost={item.cost}
            itemClass={item.class}
            index={index}
            showCost
            canSelect={selectable}
            sellId={item.sellId}
            onSelect={handleSelectItem}
            isSelected={!!selectedItemIds?.[item.sellId]}
          />
        ))}
      </div>
    </div>
  );
};

export default withAuth(Inventory);
