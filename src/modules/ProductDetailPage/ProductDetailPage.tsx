import { useCallback, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { useCart } from "../../context/CartContext";
import { getProductById, type Product } from "../../data/products";
import styles from "./ProductDetailPage.module.scss";

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const product = useMemo<Product | undefined>(() => {
    if (!productId) return undefined;
    const id = Number(productId);
    return Number.isNaN(id) ? undefined : getProductById(id);
  }, [productId]);

  const isInCart = product
    ? cartItems.some((item) => item.id === product.id)
    : false;

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    const price = parseFloat(product.price.replace("$", ""));
    addToCart({
      id: product.id,
      name: product.name,
      material: product.material,
      price,
      image: product.image,
    });
  }, [product, addToCart]);

  const handleMakeOrder = useCallback(() => {
    if (!product) return;
    navigate("/checkout", { state: { productId: product.id } });
  }, [navigate, product]);

  if (!product) {
    return (
      <div className={styles.detailNotFound}>
        <p>We could not find this product.</p>
        <Link to="/store" className={styles.detailNotFound__link}>
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.productDetail}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className={styles.productDetail__backButton}
      >
        <img src="img/icons/Arrow-right-black.svg" alt="" aria-hidden="true" />
        Back
      </button>

      <div className={styles.productDetail__media}>
        <div className={styles.productDetail__imageWrapper}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className={styles.productDetail__dots} aria-hidden="true">
          <span
            className={classNames(
              styles.productDetail__dot,
              styles["productDetail__dot--active"],
            )}
          />
          <span className={styles.productDetail__dot} />
          <span className={styles.productDetail__dot} />
          <span className={styles.productDetail__dot} />
          <span className={styles.productDetail__dot} />
          <span className={styles.productDetail__dot} />
        </div>
      </div>

      <div className={styles.productDetail__content}>
        <div className={styles.productDetail__info}>
          <h1 className={styles.productDetail__title}>
            Bed linen &quot;{product.name}&quot;
          </h1>

          <div className={styles.productDetail__spec}>
            <p>
              Material: <span>{product.material}</span>
            </p>
            <p>
              Size: <span>{product.size}</span>
            </p>
            <p>
              Color: <span>{product.color}</span>
            </p>
          </div>

          <ul className={styles.productDetail__detailsList}>
            {product.details.map((detail) => (
              <li key={detail} className={styles.productDetail__detailItem}>
                {detail}
              </li>
            ))}
          </ul>

          <p className={styles.productDetail__price}>{product.price}</p>
        </div>

        <div className={styles.productDetail__actions}>
          <button
            type="button"
            onClick={handleMakeOrder}
            className={styles.productDetail__orderButton}
          >
            Make an order
            <img
              src="img/icons/Arrow-right-light.svg"
              alt=""
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={handleAddToCart}
            className={classNames(styles.productDetail__cartButton, {
              [styles["productDetail__cartButton--added"]]: isInCart,
            })}
            aria-label={isInCart ? "Added to cart" : "Add to cart"}
          >
            <img src="img/icons/Cart-black.svg" alt="" aria-hidden="true" />
            <span className={styles.productDetail__cartLabel}>
              {isInCart ? "Added to cart" : "Add to cart"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
