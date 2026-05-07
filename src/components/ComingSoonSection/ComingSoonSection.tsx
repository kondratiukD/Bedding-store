import styles from "./ComingSoonSection.module.scss";
import { comingSoonProducts } from "../../data/products";

export const ComingSoonSection = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.container__title}>Coming soon</h2>

      <div className={styles.container__products}>
        {comingSoonProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productCard__image}>
              <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
            </div>
            <div className={styles.productCard__info}>
              <p className={styles.productCard__name}>Bed linen "{product.name}"</p>
              <p className={styles.productCard__material}>({product.material})</p>
              <p className={styles.productCard__price}>{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};