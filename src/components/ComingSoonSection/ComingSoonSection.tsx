import styles from "./ComingSoonSection.module.scss";

type Product = {
  id: number;
  image: string;
  name: string;
  material: string;
  price: string;
};

const products: Product[] = [
  {
    id: 1,
    image: "/img/mainPic/description-1.png",
    name: "Tenderness",
    material: "sateen",
    price: "12.3$",
  },
  {
    id: 2,
    image: "/img/mainPic/description-2.png",
    name: "Sweet dream",
    material: "cotton",
    price: "15$",
  },
  {
    id: 3,
    image: "/img/mainPic/mainPillow.png",
    name: "Pure",
    material: "cotton",
    price: "18$",
  },
  {
    id: 4,
    image: "/img/mainPic/description-1.png",
    name: "Comfort",
    material: "sateen",
    price: "14.5$",
  },
];

export const ComingSoonSection: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.container__title}>Coming soon</h2>

      <div className={styles.container__products}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.productCard__image}>
              <img src={product.image} alt={product.name} />
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