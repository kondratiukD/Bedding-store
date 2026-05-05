import { useCallback, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { getProductById, type Product } from '../../data/products';
import styles from './ProductDetailPage.module.scss';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = useMemo<Product | undefined>(() => {
    if (!productId) return undefined;
    const id = Number(productId);
    return Number.isNaN(id) ? undefined : getProductById(id);
  }, [productId]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    const price = parseFloat(product.price.replace('$', ''));
    addToCart({
      id: product.id,
      name: product.name,
      material: product.material,
      price,
      image: product.image,
    });
  }, [product, addToCart]);

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
      <div className={styles.productDetail__topBar}>
        <button type="button" onClick={() => navigate(-1)} className={styles.productDetail__backButton}>
          Back
        </button>
        <Link to="/store" className={styles.productDetail__catalogLink}>
          Catalog
        </Link>
      </div>

      <div className={styles.productDetail__content}>
        <div className={styles.productDetail__imageWrapper}>
          <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
        </div>

        <div className={styles.productDetail__info}>
          <span className={styles.productDetail__material}>{product.material}</span>
          <h1 className={styles.productDetail__title}>Bed linen &quot;{product.name}&quot;</h1>
          <p className={styles.productDetail__price}>{product.price}</p>
          <p className={styles.productDetail__description}>{product.description}</p>

          <div className={styles.productDetail__listWrapper}>
            <h2 className={styles.productDetail__detailsTitle}>What makes it special</h2>
            <ul className={styles.productDetail__detailsList}>
              {product.details.map((detail) => (
                <li key={detail} className={styles.productDetail__detailItem}>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <button type="button" onClick={handleAddToCart} className={styles.productDetail__actionButton}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
