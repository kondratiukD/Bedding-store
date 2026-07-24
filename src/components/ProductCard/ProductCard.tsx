import { Link } from "react-router-dom";
import styles from "./ProductCard.module.scss";
import type { Product } from "../../data/products";

type ProductCardProps = {
  product: Product;
  buttonVariant?: "primary" | "secondary";
  variant?: "default" | "carousel" | "store";
  detailPath?: string;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  buttonVariant = "primary",
  variant = "default",
  detailPath,
}) => {
  const productDetailPath = detailPath ?? `/store/${product.id}`;

  return (
    <div
      className={`${styles.card} ${variant === "carousel" ? styles["card--carousel"] : ""} ${variant === "store" ? styles["card--store"] : ""}`}
    >
      <div className={styles.card__image}>
        <Link to={productDetailPath} className={styles.card__imageLink}>
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
        </Link>
      </div>
      <div className={styles.card__info}>
        <p className={styles.card__name}>Bed linen &quot;{product.name}&quot;</p>
        <p className={styles.card__material}>({product.material})</p>
        <p className={styles.card__price}>{product.price}</p>
        <Link
          to={productDetailPath}
          className={`${styles.card__view} ${styles[`card__view--${buttonVariant}`]}`}
        >
          View
        </Link>
      </div>
    </div>
  );
};
