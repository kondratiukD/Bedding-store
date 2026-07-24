import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckoutForm } from '../../components/CheckoutForm';
import { useCart } from '../../context/CartContext';
import { getProductById } from '../../data/products';
import styles from './CheckoutPage.module.scss';

type CheckoutLocationState = {
  productId?: number;
};

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, updateQuantity } = useCart();
  const state = location.state as CheckoutLocationState | null;
  const directProductId = state?.productId;

  const directProduct = useMemo(() => {
    if (!directProductId) return undefined;
    return getProductById(directProductId);
  }, [directProductId]);

  const checkoutItems = useMemo(() => {
    if (directProduct) {
      const price = parseFloat(directProduct.price.replace('$', ''));
      return [{
        id: directProduct.id,
        name: directProduct.name,
        material: directProduct.material,
        price,
        quantity: 1,
        image: directProduct.image,
      }];
    }
    return cartItems;
  }, [cartItems, directProduct]);

  const total = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const singleItem = directProduct ? checkoutItems[0] : undefined;

  if (checkoutItems.length === 0) {
    return (
      <div className={styles.checkoutPage}>
        <button type="button" onClick={() => navigate(-1)} className={styles.checkoutPage__backButton}>
          <img src="img/icons/Arrow-right-black.svg" alt="" aria-hidden="true" />
          Back
        </button>
        <p className={styles.checkoutPage__empty}>No items to order.</p>
        <Link to="/store" className={styles.checkoutPage__catalogLink}>Go to catalog</Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>

      <button type="button" onClick={() => navigate(-1)} className={styles.checkoutPage__backButton}>
        <img src="img/icons/Arrow-right-black.svg" alt="" aria-hidden="true" />
        Back
      </button>

      {singleItem ? (
        <div className={styles.checkoutPage__layout}>
          <div className={styles.checkoutPage__product}>
            <div className={styles.checkoutPage__productImage}>
              <img src={singleItem.image} alt={singleItem.name} loading="lazy" decoding="async" />
            </div>
            <div className={styles.checkoutPage__productHeader}>
              <h2 className={styles.checkoutPage__productTitle}>
                Bed linen &quot;{singleItem.name}&quot;
              </h2>
              <p className={styles.checkoutPage__productPrice}>
                {Number.isInteger(singleItem.price)
                  ? `${singleItem.price} $`
                  : `${singleItem.price.toFixed(2)} $`}
              </p>
            </div>
          </div>

          <div className={styles.checkoutPage__form}>
            <CheckoutForm />
          </div>
        </div>
      ) : (
        <div className={styles.checkoutPage__layout}>
          <div className={styles.checkoutPage__summary}>
            <p className={styles.checkoutPage__note}>
              If you are not registered, all items in the cart will be lost.
            </p>

            <div className={styles.checkoutPage__cartItems}>
              {checkoutItems.map((item) => (
                <div key={item.id} className={styles.checkoutItem}>
                  <div className={styles.checkoutItem__image}>
                    <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                  </div>
                  <div className={styles.checkoutItem__info}>
                    <p className={styles.checkoutItem__name}>Bed linen &quot;{item.name}&quot;</p>
                    <p className={styles.checkoutItem__price}>
                      {Number.isInteger(item.price)
                        ? `${item.price} $`
                        : `${item.price.toFixed(2)} $`}
                    </p>
                    <div className={styles.checkoutItem__quantity}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.checkoutPage__totalRow}>
              <span>Total</span>
              <span>
                {Number.isInteger(total) ? `${total} $` : `${total.toFixed(2)} $`}
              </span>
            </div>
          </div>

          <div className={styles.checkoutPage__form}>
            <CheckoutForm />
          </div>
        </div>
      )}
    </div>
  );
};
