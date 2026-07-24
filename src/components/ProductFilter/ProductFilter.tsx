import React, { useCallback, useRef, useEffect, useState } from 'react';
import styles from './ProductFilter.module.scss';
import classNames from 'classnames';

export type FilterOptions = {
  sizes: string[];
  materials: string[];
  priceRange: [number, number];
  colors: string[];
};

type ProductFilterProps = {
  filters: FilterOptions;
  sizes?: string[];
  materials: string[];
  colors?: string[];
  onFilterChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onClose: () => void;
};

const DEFAULT_SIZES = ['Single', 'Double', 'King', 'Super King'];
const PRICE_MIN = 0;
const PRICE_MAX = 100;
const DEFAULT_COLORS: { [key: string]: string } = {
  White: '#FFFFFF',
  Blue: '#0052FF',
  Red: '#FF0000',
  Beige: '#D4A574',
  Yellow: '#FFFF00',
  Pink: '#FF1493',
  Green: '#00FF00',
  Purple: '#9400D3',
};

const formatPriceInput = (value: number) => {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
};

const sanitizePriceInput = (value: string) => {
  let cleaned = value.replace(/[^\d.]/g, '');
  const dotIndex = cleaned.indexOf('.');

  if (dotIndex !== -1) {
    cleaned = cleaned.slice(0, dotIndex + 1) + cleaned.slice(dotIndex + 1).replace(/\./g, '');
  }

  if (cleaned.length > 1 && cleaned.startsWith('0') && cleaned[1] !== '.') {
    cleaned = cleaned.replace(/^0+/, '');
  }

  return cleaned;
};

const parsePriceInput = (value: string, fallback: number) => {
  if (value === '' || value === '.') {
    return fallback;
  }

  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  sizes = DEFAULT_SIZES,
  materials,
  colors = Object.keys(DEFAULT_COLORS),
  onFilterChange,
  isOpen,
  onClose,
}) => {
  const minSliderRef = useRef<HTMLInputElement>(null);
  const maxSliderRef = useRef<HTMLInputElement>(null);
  const priceTrackRef = useRef<HTMLDivElement>(null);
  const [draftFilters, setDraftFilters] = useState<FilterOptions>(filters);
  const [minPriceInput, setMinPriceInput] = useState(formatPriceInput(filters.priceRange[0]));
  const [maxPriceInput, setMaxPriceInput] = useState(formatPriceInput(filters.priceRange[1]));
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);

    if (isOpen) {
      setDraftFilters(filters);
      setMinPriceInput(formatPriceInput(filters.priceRange[0]));
      setMaxPriceInput(formatPriceInput(filters.priceRange[1]));
    }
  }

  const handleSizeChange = useCallback((size: string) => {
    setDraftFilters((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  }, []);

  const handleMaterialChange = useCallback((material: string) => {
    setDraftFilters((prev) => {
      const newMaterials = prev.materials.includes(material)
        ? prev.materials.filter((m) => m !== material)
        : [...prev.materials, material];
      return { ...prev, materials: newMaterials };
    });
  }, []);

  const handleColorChange = useCallback((color: string) => {
    setDraftFilters((prev) => {
      const newColors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color];
      return { ...prev, colors: newColors };
    });
  }, []);

  const updateDraftPriceRange = useCallback((min: number, max: number) => {
    const clampedMin = Math.min(PRICE_MAX, Math.max(PRICE_MIN, min));
    const clampedMax = Math.min(PRICE_MAX, Math.max(PRICE_MIN, max));
    const newMin = Math.min(clampedMin, clampedMax);
    const newMax = Math.max(clampedMin, clampedMax);

    setDraftFilters((prev) => ({ ...prev, priceRange: [newMin, newMax] }));
    setMinPriceInput(formatPriceInput(newMin));
    setMaxPriceInput(formatPriceInput(newMax));
  }, []);

  const handlePriceInputChange = useCallback((type: 'min' | 'max', value: string) => {
    const sanitized = sanitizePriceInput(value);

    if (type === 'min') {
      setMinPriceInput(sanitized);
    } else {
      setMaxPriceInput(sanitized);
    }
  }, []);

  const commitPriceInput = useCallback(() => {
    const minValue = parsePriceInput(minPriceInput, draftFilters.priceRange[0]);
    const maxValue = parsePriceInput(maxPriceInput, draftFilters.priceRange[1]);
    updateDraftPriceRange(minValue, maxValue);
  }, [draftFilters.priceRange, maxPriceInput, minPriceInput, updateDraftPriceRange]);

  const handleSliderChange = useCallback(
    (type: 'min' | 'max', value: string) => {
      const numValue = parseFloat(value);

      if (Number.isNaN(numValue)) {
        return;
      }

      if (type === 'min') {
        updateDraftPriceRange(numValue, draftFilters.priceRange[1]);
      } else {
        updateDraftPriceRange(draftFilters.priceRange[0], numValue);
      }
    },
    [draftFilters.priceRange, updateDraftPriceRange]
  );

  const handleApply = useCallback(() => {
    const minValue = parsePriceInput(minPriceInput, draftFilters.priceRange[0]);
    const maxValue = parsePriceInput(maxPriceInput, draftFilters.priceRange[1]);
    const clampedMin = Math.min(PRICE_MAX, Math.max(PRICE_MIN, minValue));
    const clampedMax = Math.min(PRICE_MAX, Math.max(PRICE_MIN, maxValue));
    const appliedFilters: FilterOptions = {
      ...draftFilters,
      priceRange: [Math.min(clampedMin, clampedMax), Math.max(clampedMin, clampedMax)],
    };

    onFilterChange(appliedFilters);
    onClose();
  }, [draftFilters, maxPriceInput, minPriceInput, onClose, onFilterChange]);

  const formatPrice = (value: number) => {
    const formatted = Number.isInteger(value) ? value.toString() : value.toFixed(2);
    return `${formatted}$`;
  };

  // Update slider background gradient (desktop)
  useEffect(() => {
  const minPercent = (draftFilters.priceRange[0] / PRICE_MAX) * 100;
  const maxPercent = (draftFilters.priceRange[1] / PRICE_MAX) * 100;

  const leftEdge = minPercent;
  const rightEdge = maxPercent;

  const gradient = `linear-gradient(
    to right,
    #292A2B 0%,
    #292A2B ${leftEdge}%,
    #d0d0d0 ${leftEdge}%,
    #d0d0d0 ${rightEdge}%,
    #292A2B ${rightEdge}%,
    #292A2B 100%
  )`;

  if (priceTrackRef.current) {
    priceTrackRef.current.style.background = gradient;
  }
}, [draftFilters.priceRange]);

  useEffect(() => {
    document.body.classList.toggle('filters-open', isOpen);

    return () => {
      document.body.classList.remove('filters-open');
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className={styles.filterOverlay} onClick={onClose} />}
      <aside
        className={classNames(styles.filter, {
          [styles['filter--open']]: isOpen,
        })}
      >
        <div className={styles.filter__header}>
          <button 
            onClick={onClose} 
            className={styles.filter__backBtn}
            aria-label="Close filters"
          >
            <img src="img/icons/Arrow-right-black.svg" alt='Arrow Right'/>
          </button>
        </div>

        {/* Size Section */}
        <div className={styles.filter__section}>
          <h3 className={styles.filter__sectionTitle}>Size</h3>
          <div className={styles.filter__checkboxes}>
            {sizes.map((size) => (
              <label key={size} className={styles.filter__label}>
                <span className={styles.filter__labelText}>{size}</span>
                <span className={styles.filter__checkBoxWrap}>
                  <input
                    type="checkbox"
                    checked={draftFilters.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className={styles.filter__checkbox}
                  />
                  <span className={styles.filter__checkSquare} aria-hidden="true" />
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Material Section */}
        <div className={styles.filter__section}>
          <h3 className={styles.filter__sectionTitle}>Material</h3>
          <div className={styles.filter__checkboxes}>
            {materials.map((material) => (
              <label key={material} className={styles.filter__label}>
                <span className={styles.filter__labelText}>{material}</span>
                <span className={styles.filter__checkBoxWrap}>
                  <input
                    type="checkbox"
                    checked={draftFilters.materials.includes(material)}
                    onChange={() => handleMaterialChange(material)}
                    className={styles.filter__checkbox}
                  />
                  <span className={styles.filter__checkSquare} aria-hidden="true" />
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div className={styles.filter__section}>
          <h3 className={styles.filter__sectionTitle}>Price</h3>
          <div className={styles.filter__priceInputs}>
                <div className={styles.filter__priceField}>
                  <span className={styles.filter__priceFieldLabel}>From</span>
                  <div className={styles.filter__priceInputWrap}>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={minPriceInput}
                      onChange={(e) => handlePriceInputChange('min', e.target.value)}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          setMinPriceInput('');
                        }
                      }}
                      onBlur={commitPriceInput}
                      className={styles.filter__priceInput}
                      aria-label="Minimum price"
                    />
                    <span className={styles.filter__priceCurrency}>$</span>
                  </div>
                </div>
                <div className={styles.filter__priceField}>
                  <span className={styles.filter__priceFieldLabel}>To</span>
                  <div className={styles.filter__priceInputWrap}>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={maxPriceInput}
                      onChange={(e) => handlePriceInputChange('max', e.target.value)}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          setMaxPriceInput('');
                        }
                      }}
                      onBlur={commitPriceInput}
                      className={styles.filter__priceInput}
                      aria-label="Maximum price"
                    />
                    <span className={styles.filter__priceCurrency}>$</span>
                  </div>
                </div>
              </div>

              <div className={styles.filter__priceSlider}>
                <div ref={priceTrackRef} className={styles.filter__priceTrack} aria-hidden="true" />
                <input
                  ref={minSliderRef}
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step="0.01"
                  value={draftFilters.priceRange[0]}
                  onChange={(e) => handleSliderChange('min', e.target.value)}
                  className={styles.filter__slider}
                  aria-label="Minimum price"
                />
                <input
                  ref={maxSliderRef}
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step="0.01"
                  value={draftFilters.priceRange[1]}
                  onChange={(e) => handleSliderChange('max', e.target.value)}
                  className={classNames(styles.filter__slider, styles['filter__slider--max'])}
                  aria-label="Maximum price"
                />
              </div>

              <div className={styles.filter__priceValues}>
                <span className={styles.filter__priceBound}>{formatPrice(PRICE_MIN)}</span>
                <span className={styles.filter__priceSelected}>
                  {formatPrice(draftFilters.priceRange[0])} - {formatPrice(draftFilters.priceRange[1])}
                </span>
                <span className={styles.filter__priceBound}>{formatPrice(PRICE_MAX)}</span>
            </div>
        </div>

        {/* Color Section */}
        <div className={styles.filter__section}>
          <h3 className={styles.filter__sectionTitle}>Color</h3>
          <div className={styles.filter__colors}>
            {colors.map((color) => (
              <label key={color} className={styles.filter__colorLabel}>
                <input
                  type="checkbox"
                  checked={draftFilters.colors.includes(color)}
                  onChange={() => handleColorChange(color)}
                  className={styles.filter__colorCheckbox}
                  title={color}
                />
                <span 
                  className={classNames(styles.filter__colorSwatch, styles[`filter__colorSwatch--${color.toLowerCase()}` as keyof typeof styles])}
                  title={color}
                />
                <span className={styles.filter__colorName}>{color}</span>
              </label>
            ))}
          </div>
        </div>

        <button type="button" className={styles.filter__applyBtn} onClick={handleApply}>
          Apply
        </button>
      </aside>
    </>
  );
};
