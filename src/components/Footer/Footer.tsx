import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

export const Footer: React.FC = () => {
  const logoUrl = "img/Logo-Drimayko-Light.svg";

  const partnerLogos = [
    { src: "img/footerPic/img1x2.png", w: 124, h: 59},
    { src: "img/footerPic/img2x2.png", w: 124, h: 60},
    { src: "img/footerPic/img3x2.png", w: 80, h: 78},
    { src: "img/footerPic/img4x2.png", w: 98, h: 69},
    { src: "img/footerPic/img5x2.png", w: 80, h: 80},
    { src: "img/footerPic/img6x2.png", w: 124, h: 70},
  ];

  return (
    <div className={styles.footer}>
      <div className={styles.footer__content}>
        <Link className={styles.footer__logo} to="/">
          <img src={logoUrl} alt="Drimayko" />
        </Link>

        <div className={styles.footer__sections}>
          <div className={styles.footer__section}>
            <span className={styles.footer__span}>Contact us</span>
            <form className={styles.footer__form}>
              <input
                type="text"
                placeholder="Message"
                className={styles.footer__input}
              />
              <button type="submit" className={styles.footer__sendButton}>
                <img src="img/icons/SendButton.svg" alt="Send" />
              </button>
            </form>
          </div>

          <div className={styles.footer__section}>
            <h3 className={styles.footer__title}>Our socials</h3>
            <div className={styles.footer__socials}>
              <a
                href="https://facebook.com/..."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footer__socialLink}
              >
                <img src="img/icons/Facebook.svg" alt="Facebook" />
              </a>
              <a
                href="https://instagram.com/..."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footer__socialLink}
              >
                <img src="img/icons/Insta.svg" alt="Instagram" />
              </a>
              <a
                href="https://t.me/..."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footer__socialLink}
              >
                <img src="img/icons/Telegram.svg" alt="Telegram" />
              </a>
              <a
                href="https://tiktok.com/..."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footer__socialLink}
              >
                <img src="img/icons/TikTok.svg" alt="TikTok" />
              </a>
            </div>
          </div>

          <div className={styles.footer__section}>
            <h3 className={styles.footer__title}>Our email</h3>
            <a
              href="mailto:krasnohrad@redcross.org.ua"
              className={styles.footer__email}
            >
              krasnohrad@redcross.org.ua
            </a>
          </div>
        </div>

        <div className={styles.footer__partners}>
          <h1 className={styles.footer__partnerTitle}>
            The project was launched with support
          </h1>
          <div className={styles.footer__partnerImg}>
            {[0, 1, 2].map((rowIndex) => (
              <div key={rowIndex} className={`${styles.footer__partnerRow} ${styles[`footer__partnerRow--${rowIndex + 1}`]}`}>
                {partnerLogos.slice(rowIndex * 2, rowIndex * 2 + 2).map((logo, colIndex) => (
                  <div key={colIndex} className={styles.footer__partnerLogo} style={ {width: logo.w, height: logo.h} }>
                    <img src={logo.src} alt={`Partner ${rowIndex * 2 + colIndex + 1}`} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
