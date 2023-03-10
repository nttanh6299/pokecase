import styles from "@/styles/Home.module.css";

interface ItemProps {
  image: string;
  itemClass: string;
  displayName: string;
  cost: number;
  index: number | string;
  isSpinItem?: boolean;
  showCost?: boolean;
}

const Item = ({
  image,
  itemClass,
  displayName,
  cost,
  index,
  isSpinItem,
  showCost,
}: ItemProps) => {
  return (
    <div className={styles.pokemon}>
      <div className={styles.image}>
        <img
          src={image}
          width={isSpinItem ? "180px" : "140px"}
          height={isSpinItem ? "150px" : "110px"}
          style={{ objectFit: 'contain' }}
          alt={displayName}
        />
      </div>
      <div className={`${styles.text} ${styles[itemClass] || styles.default}`}>
        {displayName} {index} {showCost ? `($${cost})` : ''}
      </div>
    </div>
  );
};

export default Item;
