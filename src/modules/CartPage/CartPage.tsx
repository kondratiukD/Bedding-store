import { useMemo } from 'react';
import styles from './CartPage.module.scss';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 5 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  }, [cartItems]);

  return (
    <div className={styles.cartPage}>
      <h1 className={styles.cartPage__title}>Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className={styles.cartPage__empty}>
          <div className={styles.cartPage__emptyContent}>
            <p className={styles.cartPage__emptyText}>Your cart is empty</p>
            <p className={styles.cartPage__emptySubtext}>
              Add some wonderful bedding to get started!
            </p>
            <Link to="/store" className={styles.cartPage__emptyButton}>
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className={styles.cartPage__container}>
          <div className={styles.cartPage__items}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItem__image}>
                  <img src={item.image} alt={item.name} />
                </div>

                <div className={styles.cartItem__details}>
                  <h3 className={styles.cartItem__name}>{item.name}</h3>
                  <p className={styles.cartItem__material}>({item.material})</p>
                  <p className={styles.cartItem__price}>${item.price}</p>
                </div>

                <div className={styles.cartItem__quantity}>
                  <label htmlFor={`qty-${item.id}`} className={styles.cartItem__label}>
                    Qty
                  </label>
                  <div className={styles.cartItem__controls}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.cartItem__button}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <input
                      id={`qty-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className={styles.cartItem__input}
                    />
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.cartItem__button}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={styles.cartItem__price}>
                  <p className={styles.cartItem__itemTotal}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className={styles.cartItem__remove}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartPage__summary}>
            <div className={styles.summary}>
              <h2 className={styles.summary__title}>Order Summary</h2>

              <div className={styles.summary__row}>
                <span className={styles.summary__label}>Subtotal</span>
                <span className={styles.summary__value}>${totals.subtotal}</span>
              </div>

              <div className={styles.summary__row}>
                <span className={styles.summary__label}>Shipping</span>
                <span className={styles.summary__value}>${totals.shipping}</span>
              </div>

              <div className={styles.summary__row}>
                <span className={styles.summary__label}>Tax (10%)</span>
                <span className={styles.summary__value}>${totals.tax}</span>
              </div>

              <div className={styles.summary__divider} />

              <div className={styles.summary__row + ' ' + styles['summary__row--total']}>
                <span className={styles.summary__label}>Total</span>
                <span className={styles.summary__value}>${totals.total}</span>
              </div>

              <button className={styles.summary__button}>
                Proceed to Checkout
              </button>

              <Link to="/store" className={styles.summary__link}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
