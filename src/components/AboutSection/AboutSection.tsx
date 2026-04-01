import styles from "./AboutSection.module.scss";

export const AboutSection: React.FC = () => {
  return (
    <div className={styles.descriptions}>
      <div className={styles.descriptions__first}>
        <div className={styles.descriptions__mainContent}>
          <p
            className={`${styles.descriptions__text} ${styles["descriptions__text--first"]}`}
          >
            We are Drimayko - social bedding store from the Berestyn District
            Organization of the Ukrainian Red Cross Society.
          </p>
          <img
            className={styles.descriptions__firstImg}
            src="/img/mainPic/description-1.png"
            alt="Pillow"
          />
        </div>

        <div className={styles.descriptions__spanContainer}>
          <p className={styles.descriptions__span}>
            “Warmth in every seam - help in every product”
          </p>
        </div>
      </div>

      <div className={styles.descriptions__second}>
        <p
          className={`${styles.descriptions__text} ${styles["descriptions__text--second"]}`}
        >
          This is a special space created so that everyone can purchase
          high-quality, comfortable, and affordable bedding — with kindness and
          support.
        </p>
        <img
          className={styles.descriptions__secondImg}
          src="/img/mainPic/description-2.png"
          alt="Pillow"
        />
      </div>
    </div>
  );
};
