import { ComponentProps } from "react";
import Item from "@/components/Item";

interface SelectableItemProps extends ComponentProps<typeof Item> {
  sellId: string;
  isSelected: boolean;
  canSelect: boolean;
  onSelect: (sellId: string, cost: number) => void;
}

const SelectableItem = ({
  sellId,
  canSelect,
  isSelected,
  onSelect,
  ...itemProps
}: SelectableItemProps) => {
  const handleSelect = () => {
    if (canSelect) {
      onSelect(sellId, itemProps.cost);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        cursor: canSelect ? "pointer" : "default",
      }}
      onClick={handleSelect}
    >
      <Item {...itemProps} />
      {canSelect && (
        <div style={{ position: "absolute", top: "4px", right: "4px" }}>
          <input
            style={{ cursor: canSelect ? "pointer" : "default" }}
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
          />
        </div>
      )}
    </div>
  );
};

export default SelectableItem;
