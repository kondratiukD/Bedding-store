import React, { useCallback } from 'react';
import styles from './ProductFilter.module.scss';
import classNames from 'classnames';

export type FilterOptions = {
  materials: string[];
  priceRange: [number, number];
};

type ProductFilterProps = {
  filters: FilterOptions;
  materials: string[];
  onFilterChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onClose: () => void;
};

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  materials,
  onFilterChange,
  isOpen,
  onClose,
}) => {
  const handleMaterialChange = useCallback(
    (material: string) => {
      const newMaterials = filters.materials.includes(material)
        ? filters.materials.filter((m) => m !== material)
        : [...filters.materials, material];
      onFilterChange({ ...filters, materials: newMaterials });
    },
    [filters, onFilterChange]
  );

  const handlePriceChange = useCallback(
    (type: 'min' | 'max', value: string) => {
      const numValue = parseFloat(value) || 0;
      const newRange: [number, number] =
        type === 'min' ? [numValue, filters.priceRange[1]] : [filters.priceRange[0], numValue];
      onFilterChange({ ...filters, priceRange: newRange });
    },
    [filters, onFilterChange]
  );

  return (
    <>
      {isOpen && <div className={styles.filterOverlay} onClick={onClose} />}
      <aside
        className={classNames(styles.filter, {
          [styles['filter--open']]: isOpen,
        })}
      >
        <div className={styles.filter__header}>
          <h2 className={styles.filter__title}>Filters</h2>
          <button 
            onClick={onClose} 
            className={styles.filter__closeBtn}
            aria-label="Close filters"
          >
            ✕
          </button>
        </div>

        <div className={styles.filter__section}>
          <h3 className={styles.filter__sectionTitle}>Material</h3>
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
        </div>

        <div className={styles.filter__section}>
          <h3 className={styles.filter__sectionTitle}>Price Range</h3>
          <div className={styles.filter__priceInputs}>
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className={styles.filter__input}
            />
            <span className={styles.filter__priceSeparator}>-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className={styles.filter__input}
            />
          </div>
        </div>
      </aside>
    </>
  );
};
