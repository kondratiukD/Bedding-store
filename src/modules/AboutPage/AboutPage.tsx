import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './AboutPage.module.scss';

type TimelineItem = {
  date: string;
  text: string;
};

type AboutSlide =
  | {
      id: string;
      title: string;
      image?: string;
      type: 'timeline';
      items: TimelineItem[];
    }
  | {
      id: string;
      title: string;
      image?: string;
      type: 'text';
      text: string;
    }
  | {
      id: string;
      title: string;
      image?: string;
      type: 'list';
      items: string[];
    }
  | {
      id: string;
      title: string;
      type: 'contacts';
      phone: string;
      email: string;
      address: string;
    };

const slides: AboutSlide[] = [
  {
    id: 'our-way',
    title: 'Our way',
    image: 'img/mainPic/description-1.png',
    type: 'timeline',
    items: [
      {
        date: 'Autumn 2021 - April 2024',
        text: 'Start of participation in the program, participation in online master classes from ImpactHub.',
      },
      {
        date: 'May 2024',
        text: 'Project presentation, consultations with donors and project mentors - workshop in Lviv.',
      },
      {
        date: 'October 2024',
        text: 'Marketing and finance training, workshop in Kyiv.',
      },
    ],
  },
  {
    id: 'drimayko',
    title: 'Drimayko',
    image: 'img/mainPic/description-2.png',
    type: 'text',
    text: 'Drimayko is a social store of bed linen made by itself. The social sewing workshop is planned to be located in one of the organization\'s offices. Until the offline store opens, sales will be conducted online on social networks and through intermediaries.',
  },
  {
    id: 'stage',
    title: 'What stage are we at now?',
    image: 'img/mainPic/mainPillow.png',
    type: 'list',
    items: [
      'Equipment and materials procurement is underway.',
      'Kharkiv Regional Organization of the Ukrainian Red Cross Society is in the process of registering the opening of KVEDs and accounts in MonoBank.',
      'We are actively working on developing a marketing strategy together with a mentor, and we also consult with mentors on financial issues. We receive special support from our mentor in social entrepreneurship - Olesya Marchuk.',
      'We are developing a price list for services.',
    ],
  },
  {
    id: 'results-1',
    title: 'Our results and achievements',
    image: 'img/mainPic/description-1.png',
    type: 'list',
    items: [
      'Financial plan, budget drawn up.',
      'Grant received.',
      'Competitors analyzed.',
      'Consultations received from lawyers of the National Code.',
      'We have a team of: project manager, accountant, seamstress and organization specialist.',
    ],
  },
  {
    id: 'results-2',
    title: 'Our results and achievements',
    image: 'img/mainPic/description-2.png',
    type: 'timeline',
    items: [
      {
        date: 'June 2024',
        text: 'A trip to Vienna, Austria to the Austrian Red Cross for experience exchange within the framework of ImpactDays - we learned how social enterprises work in Societies from different countries.',
      },
      {
        date: 'March 2025',
        text: 'A trip to Yerevan, Armenia to the Armenian Red Cross for experience exchange within the framework of ImpactDays - We shared our experience of project implementation and learned how business incubators and social entrepreneurship function in Armenia.',
      },
    ],
  },
  {
    id: 'contacts',
    title: 'Our contacts',
    type: 'contacts',
    phone: '+380 99 275 87 76',
    email: 'krasnohrad@redcross.org.ua',
    address:
      'Berestyn city, Kharkiv region, Schindler Street, 87 (Territory of Berestyn city hospital, near Albolit)',
  },
];

const SWIPE_THRESHOLD = 50;

export const AboutPage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number>();
  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const pointerStartX = useRef<number | null>(null);
  const pointerStartY = useRef<number | null>(null);
  const lockDirection = useRef<'horizontal' | 'vertical' | null>(null);
  const activePointerId = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    setActiveIndex(next);
  }, []);

  const updateViewportSize = useCallback(() => {
    const viewport = viewportRef.current;
    const activeSlide = slideRefs.current[activeIndex];
    if (viewport) {
      setViewportWidth(viewport.clientWidth);
    }
    if (activeSlide) {
      setViewportHeight(activeSlide.offsetHeight);
    }
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateViewportSize();
  }, [updateViewportSize]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      updateViewportSize();
    });
    observer.observe(viewport);
    const activeSlide = slideRefs.current[activeIndex];
    if (activeSlide) observer.observe(activeSlide);
    window.addEventListener('resize', updateViewportSize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateViewportSize);
    };
  }, [activeIndex, updateViewportSize]);

  const finishDrag = useCallback((clientX: number) => {
    if (pointerStartX.current === null) return;

    const delta = clientX - pointerStartX.current;
    const wasHorizontal = lockDirection.current !== 'vertical';

    pointerStartX.current = null;
    pointerStartY.current = null;
    lockDirection.current = null;
    activePointerId.current = null;
    setIsDragging(false);
    setDragOffset(0);

    if (!wasHorizontal) return;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    goTo(activeIndex + (delta < 0 ? 1 : -1));
  }, [activeIndex, goTo]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('a, button, input, textarea, select, label')) return;

    pointerStartX.current = event.clientX;
    pointerStartY.current = event.clientY;
    lockDirection.current = null;
    activePointerId.current = event.pointerId;
    setIsDragging(true);
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerStartX.current === null || pointerStartY.current === null) return;
    if (activePointerId.current !== event.pointerId) return;

    const deltaX = event.clientX - pointerStartX.current;
    const deltaY = event.clientY - pointerStartY.current;

    if (!lockDirection.current) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
      lockDirection.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      if (lockDirection.current === 'vertical') {
        setIsDragging(false);
        setDragOffset(0);
        return;
      }
    }

    if (lockDirection.current === 'vertical') return;

    event.preventDefault();

    let nextOffset = deltaX;
    if (
      (activeIndex === 0 && deltaX > 0) ||
      (activeIndex === slides.length - 1 && deltaX < 0)
    ) {
      nextOffset = deltaX * 0.35;
    }

    setDragOffset(nextOffset);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;
    finishDrag(event.clientX);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) return;
    pointerStartX.current = null;
    pointerStartY.current = null;
    lockDirection.current = null;
    activePointerId.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const progress = ((activeIndex + 1) / slides.length) * 100;
  const trackOffset = viewportWidth
    ? -(activeIndex * viewportWidth) + dragOffset
    : 0;

  return (
    <div className={styles.aboutPage}>
      <div className={styles.aboutPage__progress} aria-hidden="true">
        <div className={styles.aboutPage__progressTrack}>
          <div className={styles.aboutPage__progressFill} style={{ width: `${progress}%` }} />
          <div className={styles.aboutPage__progressDots}>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={classNames(styles.aboutPage__progressDot, {
                  [styles['aboutPage__progressDot--active']]: index === activeIndex,
                  [styles['aboutPage__progressDot--passed']]: index <= activeIndex,
                })}
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}: ${slide.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        ref={viewportRef}
        className={classNames(styles.aboutPage__viewport, {
          [styles['aboutPage__viewport--dragging']]: isDragging && lockDirection.current !== 'vertical',
        })}
        style={viewportHeight ? { height: viewportHeight } : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className={styles.aboutPage__track}
          style={{
            width: viewportWidth ? viewportWidth * slides.length : undefined,
            transform: viewportWidth ? `translate3d(${trackOffset}px, 0, 0)` : undefined,
            transition: isDragging ? 'none' : undefined,
          }}
        >
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              ref={(element) => {
                slideRefs.current[index] = element;
              }}
              className={styles.aboutSlide}
              style={viewportWidth ? { width: viewportWidth } : undefined}
              aria-hidden={index !== activeIndex}
            >
              <div className={styles.aboutSlide__body}>
                <h2 className={styles.aboutSlide__title}>{slide.title}</h2>

                {slide.type === 'timeline' && (
                  <div className={styles.aboutSlide__timeline}>
                    {slide.items.map((item) => (
                      <div key={item.date} className={styles.aboutSlide__timelineItem}>
                        <p className={styles.aboutSlide__date}>{item.date}</p>
                        <p className={styles.aboutSlide__text}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {slide.type === 'text' && (
                  <p className={styles.aboutSlide__text}>{slide.text}</p>
                )}

                {slide.type === 'list' && (
                  <ol className={styles.aboutSlide__list}>
                    {slide.items.map((item, itemIndex) => (
                      <li key={item} className={styles.aboutSlide__listItem}>
                        {itemIndex + 1}. {item}
                      </li>
                    ))}
                  </ol>
                )}

                {slide.type === 'contacts' && (
                  <div className={styles.aboutSlide__contacts}>
                    <div className={styles.aboutSlide__contactBlock}>
                      <p className={styles.aboutSlide__contactLabel}>
                        Information phone number of the organization
                      </p>
                      <a href={`tel:${slide.phone.replace(/\s/g, '')}`} className={styles.aboutSlide__contactValue}>
                        {slide.phone}
                      </a>
                    </div>
                    <div className={styles.aboutSlide__contactBlock}>
                      <p className={styles.aboutSlide__contactLabel}>Mail</p>
                      <a href={`mailto:${slide.email}`} className={styles.aboutSlide__contactValue}>
                        {slide.email}
                      </a>
                    </div>
                    <div className={styles.aboutSlide__contactBlock}>
                      <p className={styles.aboutSlide__contactLabel}>Address</p>
                      <p className={styles.aboutSlide__contactValue}>{slide.address}</p>
                    </div>
                  </div>
                )}
              </div>

              {slide.type === 'contacts' ? (
                <div className={styles.aboutSlide__qr}>
                  <img src="img/mainPic/contacts-qr.png" alt="QR code for contacts" />
                </div>
              ) : (
                <div className={styles.aboutSlide__media}>
                  <div className={styles.aboutSlide__image}>
                    {slide.image ? (
                      <img src={slide.image} alt="" loading="lazy" decoding="async" draggable={false} />
                    ) : null}
                  </div>
                  <div className={styles.aboutSlide__mediaDots} aria-hidden="true">
                    <span className={classNames(styles.aboutSlide__mediaDot, styles['aboutSlide__mediaDot--active'])} />
                    <span className={styles.aboutSlide__mediaDot} />
                    <span className={styles.aboutSlide__mediaDot} />
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
