import { Link } from "react-router-dom";
import styles from "./HeroSection.module.scss";

export const HeroSection: React.FC = () => {
  const logoUrl = "/img/Logo-Drimayko-Light.svg";

  return (
    <div className={styles.container}>
      <div className={styles.container__logo}>
        <img src={logoUrl} alt="Drimayko" />
      </div>
      
      <div className={styles.container__info}>
        <div className={styles.container__imgs}>
          <img src="/img/mainPic/mainPillow.png" alt="Main pillow" />
          <img
            className={styles.redCross}
            src="/img/Red-Cross-Logo2.png"
            alt="Red Cross badge"
          />
        </div>

        <div className={styles.container__description}>
          <h1 className={styles.container__title}>
            Social store of home-made bed linen
          </h1>

          <div className={styles.container__buttons}>
            <Link
              to="/order"
              className={`${styles.button} ${styles["button--primary"]}`}
            >
              <span className={styles.buttonText}>Make an order</span>
              <img
                className={styles.buttonIcon}
                src="/img/icons/Cart.svg"
                alt="Make an order"
              />
            </Link>

            <Link
              to="/profile"
              className={`${styles.button} ${styles["button--secondary"]}`}
            >
              <span className={styles.buttonText}>Create a profile</span>
              <img
                className={styles.buttonIcon}
                src="/img/icons/Arrow-right-black.svg"
                alt="Create a profile"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
