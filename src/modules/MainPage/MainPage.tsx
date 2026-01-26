import styles from './MainPage.module.scss';
import { HeroSection } from '../../components/HeroSection';
import { ComingSoonSection } from '../../components/ComingSoonSection';
import { AboutSection } from '../../components/AboutSection';

export const MainPage: React.FC = () => (
  <div className={styles.mainContainer}>
    <div>
      <HeroSection />
    </div>

    <div className={styles.line}></div>

    <div>
      <ComingSoonSection />
    </div>

    <div className={styles.line}></div>

    <div>
      <AboutSection />
    </div>
  </div>
)