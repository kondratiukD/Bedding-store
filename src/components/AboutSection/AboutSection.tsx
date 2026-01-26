import styles from './AboutSection.module.scss';


export const AboutSection: React.FC = () => {
    return (
        <div className={styles.decriptions}>
            <div className={styles.descriptions__first}>
                <p className={styles.description__text}>
                    We are Drimayko - social bedding store from the Berestyn District Organization of the Ukrainian Red Cross Society.
                </p>
                <img src='/img/mainPic/description-1.png' alt='Pillow'/>

                <span className={styles.span}>“Warmth in every seam - help in every product”</span>

                
            </div>

            <div className={styles.descriptions__second}>
                <p className={styles.description__text}>
                    This is a special space created so that everyone can purchase high-quality, comfortable, and affordable bedding — with kindness and support.
                </p>
                <img src='/img/mainPic/description-2.png' alt='Pillow'/>
            </div>
        </div>
    );
}