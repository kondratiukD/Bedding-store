import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckoutForm } from '../../components/CheckoutForm';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from './CartPage.module.scss';

export const CartPage: React.FC = () => {
  const { user } = useAuth();
  const { cartItems, updateQuantity } = useCart();

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  if (cartItems.length === 0) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.cartPage__empty}>
          <p className={styles.cartPage__emptyText}>Your cart is empty</p>
          <p className={styles.cartPage__emptySubtext}>
            Add some wonderful bedding to get started!
          </p>
          <Link to="/store" className={styles.cartPage__emptyButton}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      {!user && (
        <p className={styles.cartPage__note}>
          If you are not registered, all items in the cart will be lost.
        </p>
      )}

      <div className={styles.cartPage__layout}>
        <div className={styles.cartPage__summary}>
          <div className={styles.cartPage__items}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItem__image}>
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                </div>
                <p className={styles.cartItem__name}>Bed linen &quot;{item.name}&quot;</p>
                <p className={styles.cartItem__price}>
                  {Number.isInteger(item.price) ? `${item.price} $` : `${item.price.toFixed(2)} $`}
                </p>
                <div className={styles.cartItem__quantity}>
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
            ))}
          </div>

          <div className={styles.cartPage__total}>
            <span className={styles.cartPage__totalLabel}>Total</span>
            <span className={styles.cartPage__totalValue}>
              {Number.isInteger(total) ? `${total} $` : `${total.toFixed(2)} $`}
            </span>
          </div>
        </div>

        <div className={styles.cartPage__form}>
          <CheckoutForm />
        </div>
      </div>
    </div>
  );
};
