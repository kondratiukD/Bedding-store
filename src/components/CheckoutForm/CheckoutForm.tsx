import { useState } from 'react';
import styles from './CheckoutForm.module.scss';

export const CheckoutForm: React.FC = () => {
  const [rememberMe, setRememberMe] = useState(true);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSuccessOpen(true);
  };

  return (
    <>
      <form className={styles.checkoutForm} onSubmit={handleSubmit}>
        <label className={styles.checkoutForm__field}>
          <span>Enter your name</span>
          <input type="text" placeholder="Kateryna" />
        </label>

        <label className={styles.checkoutForm__field}>
          <span>Enter your number</span>
          <div className={styles.checkoutForm__phone}>
            <span className={styles.checkoutForm__phonePrefix}>
              <img src="img/icons/Flag.svg" alt="" aria-hidden="true" />
              +380
            </span>
            <input type="tel" placeholder="00 000 00 00" />
          </div>
        </label>

        <label className={styles.checkoutForm__field}>
          <span>Enter your city</span>
          <input type="text" placeholder="Lviv, Ukraine" />
        </label>

        <label className={styles.checkoutForm__field}>
          <span>Delivery method</span>
          <select defaultValue="" className={styles.checkoutForm__select}>
            <option value="" disabled>Choose a delivery method</option>
            <option value="nova-poshta">Nova Poshta</option>
            <option value="ukrposhta">Ukrposhta</option>
          </select>
        </label>

        <label className={styles.checkoutForm__field}>
          <span>Post office number</span>
          <select defaultValue="" className={styles.checkoutForm__select}>
            <option value="" disabled>Choose a post office number</option>
            <option value="1">Post office #1</option>
            <option value="2">Post office #2</option>
          </select>
        </label>

        <label className={styles.checkoutForm__field}>
          <span>Enter your card number</span>
          <input type="text" inputMode="numeric" placeholder="0000 0000 0000 0000" />
        </label>

        <div className={styles.checkoutForm__field}>
          <span>CVV</span>
          <div className={styles.checkoutForm__cvv}>
            <input type="text" inputMode="numeric" maxLength={1} placeholder="0" aria-label="CVV digit 1" />
            <input type="text" inputMode="numeric" maxLength={1} placeholder="0" aria-label="CVV digit 2" />
            <input type="text" inputMode="numeric" maxLength={1} placeholder="0" aria-label="CVV digit 3" />
          </div>
        </div>

        <label className={styles.checkoutForm__remember}>
          <span>Remember me</span>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className={styles.checkoutForm__rememberInput}
          />
          <span className={styles.checkoutForm__rememberBox} aria-hidden="true">
            {rememberMe && (
              <img src="img/icons/iconYes.svg" alt="" />
            )}
          </span>
        </label>

        <button type="submit" className={styles.checkoutForm__payButton}>Pay</button>
      </form>

      {isSuccessOpen && (
        <div
          className={styles.successModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-title"
        >
          <div
            className={styles.successModal__backdrop}
            onClick={() => setIsSuccessOpen(false)}
          />
          <div className={styles.successModal__card}>
            <h2 id="order-success-title">Order successful!</h2>
            <p>The details will be sent to your phone number.</p>
            <button
              type="button"
              className={styles.successModal__button}
              onClick={() => setIsSuccessOpen(false)}
            >
              OK
              <img src="img/icons/iconYes.svg" alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
