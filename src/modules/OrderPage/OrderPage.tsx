import { useRef } from "react";
import type { Product } from "../../data/products";
import { ProductCard } from "../../components/ProductCard";
import { newProducts, mostChosenProducts, forChildrenProducts } from "../../data/products";
import styles from "./OrderPage.module.scss";

type ProductSectionProps = {
  title: string;
  products: Product[];
  buttonVariant: "primary" | "secondary";
  layout: "grid" | "carousel";
};

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  buttonVariant,
  layout,
}) => {
  const productsRef = useRef<HTMLDivElement>(null);

  const handleMoreClick = () => {
    productsRef.current?.scrollBy({ left: 350, behavior: "smooth" });
  };

  return (
  <div className={`${styles.section} ${styles[`section--${layout}`]}`}>
    <h2 className={styles.section__title}>{title}</h2>
    <div ref={productsRef} className={styles.section__products}>
      {products.map((product) => (
        <div key={product.id} className={styles.productCardWrapper}>
          <ProductCard
            product={product}
            buttonVariant={buttonVariant}
            variant={layout === "carousel" ? "carousel" : "default"}
          />
        </div>
      ))}
    </div>

    {layout === "carousel" && (
      <button
        type="button"
        className={styles.section__more}
        onClick={handleMoreClick}
        aria-label="Scroll carousel right"
      >
        <img src="img/icons/Arrow-right-light.svg" alt="Arrow right" />
        <span className={styles.spanMore}>More</span>
      </button>
    )}

  </div>
  );
};

export const OrderPage: React.FC = () => {
  return (
    <div className={styles.orderPage}>
      <ProductSection
        title="New products this week"
        products={newProducts}
        buttonVariant="primary"
        layout="grid"
      />

      <div className={styles.line}></div>

      <ProductSection
        title="Most choosen"
        products={mostChosenProducts}
        buttonVariant="secondary"
        layout="carousel"
      />
      <div className={styles.line}></div>

      <ProductSection
        title="For children"
        products={forChildrenProducts}
        buttonVariant="secondary"
        layout="carousel"
      />
    </div>
  );
};
