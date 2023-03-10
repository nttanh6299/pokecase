import { useEffect, useState } from "react";
import withAuth from "@/components/withAuth";
import { getItems, Item } from "@/apis/item";
import { ITEM_CLASSES, SORT_OPTIONS } from "@/constants/common";
import styles from "@/styles/Inventory.module.css";
import ItemComponent from "@/components/Item";
import useFilter, { allOption } from "@/hooks/useFilter";
import SearchInput from "@/modules/Inventory/SearchInput";

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
  } = useFilter();

  useEffect(() => {
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

    const fetchItems = async () => {
      const { data } = await getItems(filterParams);
      setItems(data.data || []);
    };

    fetchItems();
  }, [filters, sortBy, sortDirection, keyword]);

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

      <div>
        {items?.map((item, index) => (
          <ItemComponent
            key={index}
            image={item.image}
            displayName={item.displayName}
            cost={item.cost}
            itemClass={item.class}
            index={index}
            showCost
          />
        ))}
      </div>
    </div>
  );
};

export default withAuth(Inventory);
