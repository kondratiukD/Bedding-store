import { ProductCard, type Product } from "../../components/ProductCard";
import styles from "./StorePage.module.scss";

// type Product = {
//   id: number;
//   image: string;
//   name: string;
//   material: string;
//   price: string;
// };

const storeProducts: Product[] = [
  { id: 1, image: "/img/mainPic/description-1.png", name: "Moonlight", material: "sateen", price: "12.5$" },
  { id: 2, image: "/img/mainPic/description-2.png", name: "Morning dew", material: "sateen", price: "14$" },
  { id: 3, image: "/img/mainPic/mainPillow.png", name: "Lavender dreams", material: "sateen", price: "13.5$" },
  { id: 4, image: "/img/mainPic/description-1.png", name: "Silence of the Carpathians", material: "sateen", price: "12$" },
  { id: 5, image: "/img/mainPic/description-2.png", name: "Starry blanket", material: "sateen", price: "12.5$" },
  { id: 6, image: "/img/mainPic/mainPillow.png", name: "Sunny field", material: "sateen", price: "12.5$" },
];

export const StorePage: React.FC = () => {
  return (
    <div className={styles.storePage}>
      <div className={styles.storePage__filter}>
        <button type="button" className={styles.storePage__filterButton} aria-label="Open filters">
        <img src="/img/icons/Arrow-right-light.svg"/>
      </button>

      <span className={styles.storePage__filterText}>Filters</span>
      </div>

      <div className={styles.storePage__products}>
        {storeProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <ProductCard product={product} buttonVariant="secondary" variant="store" />
          </div>
        ))}
      </div>
    </div>
  );
};
