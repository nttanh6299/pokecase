import styles from "@/styles/Home.module.css";

interface ItemProps {
  image: string;
  itemClass: string;
  displayName: string;
  index: number | string;
  isSpinItem?: boolean;
}

const Item = ({
  image,
  itemClass,
  displayName,
  index,
  isSpinItem,
}: ItemProps) => {
  return (
    <div className={styles.pokemon}>
      <div className={styles.image}>
        <img
          src={image}
          width={isSpinItem ? "180px" : "110px"}
          height={isSpinItem ? "150px" : "100px"}
        />
      </div>
      <div className={`${styles.text} ${styles[itemClass] || styles.default}`}>
        {displayName} {index}
      </div>
    </div>
  );
};

export default Item;
