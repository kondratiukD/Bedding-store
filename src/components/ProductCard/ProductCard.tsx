import { useState, useCallback } from "react";
import styles from "./ProductCard.module.scss";
import { useCart } from "../../context/CartContext";

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
}) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = useCallback(() => {
    const price = parseFloat(product.price.replace('$', ''));
    addToCart({
      id: product.id,
      name: product.name,
      material: product.material,
      price,
      image: product.image,
    });
    
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }, [product, addToCart]);

  return (
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
          onClick={handleAddToCart}
          className={`${styles.card__view} ${styles[`card__view--${buttonVariant}`]} ${
            isAdded ? styles["card__view--added"] : ""
          }`}
        >
          {isAdded ? "Added! ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};
