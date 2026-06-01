import React, { useCallback, useState, useRef, useEffect } from 'react';
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

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  sizes = DEFAULT_SIZES,
  materials,
  colors = Object.keys(DEFAULT_COLORS),
  onFilterChange,
  isOpen,
  onClose,
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['Material'])
  );
  const minSliderRef = useRef<HTMLInputElement>(null);
  const maxSliderRef = useRef<HTMLInputElement>(null);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  }, []);

  const handleSizeChange = useCallback(
    (size: string) => {
      const newSizes = filters.sizes.includes(size)
        ? filters.sizes.filter((s) => s !== size)
        : [...filters.sizes, size];
      onFilterChange({ ...filters, sizes: newSizes });
    },
    [filters, onFilterChange]
  );

  const handleMaterialChange = useCallback(
    (material: string) => {
      const newMaterials = filters.materials.includes(material)
        ? filters.materials.filter((m) => m !== material)
        : [...filters.materials, material];
      onFilterChange({ ...filters, materials: newMaterials });
    },
    [filters, onFilterChange]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      const newColors = filters.colors.includes(color)
        ? filters.colors.filter((c) => c !== color)
        : [...filters.colors, color];
      onFilterChange({ ...filters, colors: newColors });
    },
    [filters, onFilterChange]
  );

  const handlePriceChange = useCallback(
    (type: 'min' | 'max', value: string) => {
      let numValue = parseFloat(value) || 0;
      
      // Удаляем нуль в начале при вводе нового числа
      if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
        numValue = parseFloat(value.substring(1)) || 0;
      }
      
      const newRange: [number, number] = type === 'min' 
        ? [Math.min(numValue, filters.priceRange[1]), filters.priceRange[1]]
        : [filters.priceRange[0], Math.max(numValue, filters.priceRange[0])];
      
      onFilterChange({ ...filters, priceRange: newRange });
    },
    [filters, onFilterChange]
  );

  // Update slider background gradient
  useEffect(() => {
    const minPercent = (filters.priceRange[0] / 50) * 100;
    const maxPercent = (filters.priceRange[1] / 50) * 100;
    
    if (minSliderRef.current) {
      minSliderRef.current.style.background = `linear-gradient(to right, #d0d0d0 0%, #d0d0d0 ${minPercent}%, #333333 ${minPercent}%, #333333 ${maxPercent}%, #d0d0d0 ${maxPercent}%, #d0d0d0 100%)`;
    }
    
    if (maxSliderRef.current) {
      maxSliderRef.current.style.background = `linear-gradient(to right, #d0d0d0 0%, #d0d0d0 ${minPercent}%, #333333 ${minPercent}%, #333333 ${maxPercent}%, #d0d0d0 ${maxPercent}%, #d0d0d0 100%)`;
    }
  }, [filters.priceRange]);

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
            {'<'}
          </button>
        </div>

        {/* Size Section */}
        <div className={styles.filter__section}>
          <button 
            className={styles.filter__sectionToggle}
            onClick={() => toggleSection('Size')}
          >
            <h3 className={styles.filter__sectionTitle}>Size</h3>
            <span className={classNames(styles.filter__toggleIcon, {
              [styles['filter__toggleIcon--expanded']]: expandedSections.has('Size')
            })}>
              {'▼'}
            </span>
          </button>
          {expandedSections.has('Size') && (
            <div className={styles.filter__checkboxes}>
              {sizes.map((size) => (
                <label key={size} className={styles.filter__label}>
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className={styles.filter__checkbox}
                  />
                  <span className={styles.filter__labelText}>{size}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Material Section */}
        <div className={styles.filter__section}>
          <button 
            className={styles.filter__sectionToggle}
            onClick={() => toggleSection('Material')}
          >
            <h3 className={styles.filter__sectionTitle}>Material</h3>
            <span className={classNames(styles.filter__toggleIcon, {
              [styles['filter__toggleIcon--expanded']]: expandedSections.has('Material')
            })}>
              {'▼'}
            </span>
          </button>
          {expandedSections.has('Material') && (
            <div className={styles.filter__checkboxes}>
              {materials.map((material) => (
                <label key={material} className={styles.filter__label}>
                  <input
                    type="checkbox"
                    checked={filters.materials.includes(material)}
                    onChange={() => handleMaterialChange(material)}
                    className={styles.filter__checkbox}
                  />
                  <span className={styles.filter__labelText}>{material}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Section */}
        <div className={styles.filter__section}>
          <button 
            className={styles.filter__sectionToggle}
            onClick={() => toggleSection('Price')}
          >
            <h3 className={styles.filter__sectionTitle}>Price</h3>
            <span className={classNames(styles.filter__toggleIcon, {
              [styles['filter__toggleIcon--expanded']]: expandedSections.has('Price')
            })}>
              {'▼'}
            </span>
          </button>
          {expandedSections.has('Price') && (
            <>
              <div className={styles.filter__priceSlider}>
                <input
                  ref={minSliderRef}
                  type="range"
                  min="0"
                  max="50"
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className={styles.filter__slider}
                  aria-label="Minimum price"
                />
                <input
                  ref={maxSliderRef}
                  type="range"
                  min="0"
                  max="50"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className={classNames(styles.filter__slider, styles['filter__slider--max'])}
                  aria-label="Maximum price"
                />
              </div>
              <div className={styles.filter__priceValues}>
                <span>${filters.priceRange[0].toFixed(2)}</span>
                <span>-</span>
                <span>${filters.priceRange[1].toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Color Section */}
        <div className={styles.filter__section}>
          <button 
            className={styles.filter__sectionToggle}
            onClick={() => toggleSection('Color')}
          >
            <h3 className={styles.filter__sectionTitle}>Color</h3>
            <span className={classNames(styles.filter__toggleIcon, {
              [styles['filter__toggleIcon--expanded']]: expandedSections.has('Color')
            })}>
              {'▼'}
            </span>
          </button>
          {expandedSections.has('Color') && (
            <div className={styles.filter__colors}>
              {colors.map((color) => (
                <label key={color} className={styles.filter__colorLabel}>
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color)}
                    onChange={() => handleColorChange(color)}
                    className={styles.filter__colorCheckbox}
                    title={color}
                  />
                  <span 
                    className={classNames(styles.filter__colorSwatch, styles[`filter__colorSwatch--${color.toLowerCase()}` as any])}
                    title={color}
                  />
                  <span className={styles.filter__colorName}>{color}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
