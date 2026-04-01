import styles from './AboutPage.module.scss';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.aboutPage__header}>
        <div className={styles.aboutPage__headerContent}>
          <h1 className={styles.aboutPage__title}>About Drimayko</h1>
          <p className={styles.aboutPage__subtitle}>
            Social bedding store from the Berestyn District Organization of the Ukrainian Red Cross Society
          </p>
        </div>
      </div>

      <section className={styles.section}>
        <div className={styles.section__container}>
          <div className={styles.section__content}>
            <h2 className={styles.section__title}>Our Mission</h2>
            <p className={styles.section__text}>
              We are dedicated to providing high-quality, comfortable, and affordable bedding while supporting
              social causes. Every purchase contributes to the Ukrainian Red Cross Society's mission of helping
              those in need across our community.
            </p>
            <p className={styles.section__text}>
              At Drimayko, we believe that everyone deserves quality sleep and comfort. That's why we create
              wonderful bed linen with love and care, ensuring every product meets the highest standards.
            </p>
          </div>
          <div className={styles.section__image}>
            <img src="/img/mainPic/mainPillow.png" alt="Quality bedding" />
          </div>
        </div>
      </section>

      <section className={styles.section + ' ' + styles['section--alternate']}>
        <div className={styles.section__container}>
          <div className={styles.section__image}>
            <img src="/img/mainPic/description-1.png" alt="Red Cross Partnership" />
          </div>
          <div className={styles.section__content}>
            <h2 className={styles.section__title}>Our Partnership with Red Cross</h2>
            <p className={styles.section__text}>
              As a social enterprise under the Berestyn District Organization of the Ukrainian Red Cross
              Society, we combine commerce with compassion. Part of every sale goes directly to supporting
              humanitarian efforts in our region.
            </p>
            <p className={styles.section__text}>
              We're proud to be part of a movement that proves business can be a force for good. Through our
              partnership, we help provide aid, emergency assistance, and support to vulnerable communities.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.section__container}>
          <div className={styles.section__content}>
            <h2 className={styles.section__title}>Why Choose Our Bedding?</h2>
            <div className={styles.features}>
              <div className={styles.feature}>
                <h3 className={styles.feature__title}>Premium Quality</h3>
                <p className={styles.feature__text}>
                  We use only the finest materials like sateen, cotton, and linen to ensure comfort and durability.
                </p>
              </div>
              <div className={styles.feature}>
                <h3 className={styles.feature__title}>Sustainable & Ethical</h3>
                <p className={styles.feature__text}>
                  Our production methods respect both people and the environment, following ethical standards.
                </p>
              </div>
              <div className={styles.feature}>
                <h3 className={styles.feature__title}>Affordable Prices</h3>
                <p className={styles.feature__text}>
                  We believe quality shouldn't be expensive. That's why we keep our prices competitive and fair.
                </p>
              </div>
              <div className={styles.feature}>
                <h3 className={styles.feature__title}>Social Impact</h3>
                <p className={styles.feature__text}>
                  Every purchase supports the Red Cross in helping those who need it most. Shopping with purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section + ' ' + styles['section--highlight']}>
        <div className={styles.section__container}>
          <h2 className={styles.section__title}>Materials We Use</h2>
          <div className={styles.materials}>
            <div className={styles.material}>
              <h3 className={styles.material__name}>Sateen</h3>
              <p className={styles.material__description}>
                Luxurious and smooth, sateen bedding offers a silky feel and excellent durability.
              </p>
            </div>
            <div className={styles.material}>
              <h3 className={styles.material__name}>Cotton</h3>
              <p className={styles.material__description}>
                Breathable and comfortable, 100% cotton bedding is perfect for year-round use.
              </p>
            </div>
            <div className={styles.material}>
              <h3 className={styles.material__name}>Linen</h3>
              <p className={styles.material__description}>
                Natural and temperature-regulating, linen bedding keeps you cool in summer and warm in winter.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.section__container}>
          <div className={styles.cta}>
            <h2 className={styles.cta__title}>Ready to Experience Quality Sleep?</h2>
            <p className={styles.cta__text}>
              Explore our full collection of beautiful, comfortable bedding that supports a good cause.
            </p>
            <Link to="/store" className={styles.cta__button}>
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section + ' ' + styles['section--contact']}>
        <div className={styles.section__container}>
          <h2 className={styles.section__title}>Get in Touch</h2>
          <div className={styles.contact}>
            <div className={styles.contact__item}>
              <h3 className={styles.contact__label}>Email</h3>
              <a href="mailto:info@drimayko.com" className={styles.contact__link}>
                info@drimayko.com
              </a>
            </div>
            <div className={styles.contact__item}>
              <h3 className={styles.contact__label}>Phone</h3>
              <a href="tel:+380123456789" className={styles.contact__link}>
                +380 (123) 456-789
              </a>
            </div>
            <div className={styles.contact__item}>
              <h3 className={styles.contact__label}>Follow Us</h3>
              <div className={styles.contact__socials}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.contact__social}>
                  Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.contact__social}>
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
