import styles from "./ProductCard.module.scss";

export type Product = {
  id: number;
  image: string;
  name: string;
  material: string;
  price: string;
};

type ProductCardProps = {
  product: Product;
  buttonVariant?: "primary" | "secondary";
  variant?: "default" | "carousel" | "store";
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  buttonVariant = "secondary",
  variant = "default",
}) => (
  <div
    className={`${styles.card} ${variant === "carousel" ? styles["card--carousel"] : ""} ${variant === "store" ? styles["card--store"] : ""}`}
  >
    <div className={styles.card__image}>
      <img src={product.image} alt={product.name} />
    </div>
    <div className={styles.card__info}>
      <p className={styles.card__name}>Bed linen &quot;{product.name}&quot;</p>
      <p className={styles.card__material}>({product.material})</p>
      <p className={styles.card__price}>{product.price}</p>
      <button
        type="button"
        className={`${styles.card__view} ${styles[`card__view--${buttonVariant}`]}`}
      >
        View
      </button>
    </div>
  </div>
);
