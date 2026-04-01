import { useRef } from "react";
import { ProductCard, type Product } from "../../components/ProductCard";
import styles from "./OrderPage.module.scss";

const newProducts: Product[] = [
  {
    id: 1,
    image: "/img/mainPic/description-1.png",
    name: "Dream in pales",
    material: "cotton",
    price: "12$",
  },
  {
    id: 2,
    image: "/img/mainPic/description-2.png",
    name: "Don't wake me up!",
    material: "cotton",
    price: "14.9$",
  },
  {
    id: 3,
    image: "/img/mainPic/mainPillow.png",
    name: "Freshness",
    material: "cotton",
    price: "11.9$",
  },
];

const mostChosen: Product[] = [
  {
    id: 4,
    image: "/img/mainPic/description-1.png",
    name: "In a dream - somewhere here",
    material: "cotton",
    price: "12.4$",
  },
  {
    id: 5,
    image: "/img/mainPic/description-2.png",
    name: "Dream in pales",
    material: "cotton",
    price: "13.1$",
  },
  {
    id: 6,
    image: "/img/mainPic/mainPillow.png",
    name: "Pajama conspiracy",
    material: "cotton",
    price: "12$",
  },
  {
    id: 7,
    image: "/img/mainPic/description-1.png",
    name: "Don't wake me up!",
    material: "cotton",
    price: "14.5$",
  },
  {
    id: 8,
    image: "/img/mainPic/description-2.png",
    name: "Not for Mondays",
    material: "cotton",
    price: "11.8$",
  },
];

const forChildren: Product[] = [
  {
    id: 9,
    image: "/img/mainPic/description-1.png",
    name: "Stars under the pillow",
    material: "cotton",
    price: "13$",
  },
  {
    id: 10,
    image: "/img/mainPic/description-2.png",
    name: "Cloud for the night",
    material: "cotton",
    price: "12$",
  },
  {
    id: 11,
    image: "/img/mainPic/mainPillow.png",
    name: "Where does the rainbow sleep?",
    material: "cotton",
    price: "12$",
  },
  {
    id: 12,
    image: "/img/mainPic/description-1.png",
    name: "Under the bed blanket lives a fairy tale",
    material: "cotton",
    price: "14.5$",
  },
  {
    id: 13,
    image: "/img/mainPic/description-2.png",
    name: "Journey to the Moon",
    material: "cotton",
    price: "11.8$",
  },
];

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
        <img src="/img/icons/Arrow-right-light.svg" alt="Arrow right" />
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
        products={mostChosen}
        buttonVariant="secondary"
        layout="carousel"
      />
      <div className={styles.line}></div>

      <ProductSection
        title="For children"
        products={forChildren}
        buttonVariant="secondary"
        layout="carousel"
      />
    </div>
  );
};
