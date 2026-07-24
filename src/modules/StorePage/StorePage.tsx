import { useState, useMemo, useCallback } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { ProductFilter, type FilterOptions } from '../../components/ProductFilter';
import { Pagination } from '../../components/Pagination';
import { storeProducts } from '../../data/products';
import styles from './StorePage.module.scss';

const ITEMS_PER_PAGE = 6;

export const StorePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sizes: [],
    materials: [],
    priceRange: [0, 100],
    colors: [],
  });

  const availableMaterials = useMemo(() => {
    const materials = new Set(storeProducts.map((p) => p.material));
    return Array.from(materials).sort();
  }, []);

  const availableSizes = useMemo(() => {
    const sizes = new Set(storeProducts.map((p) => p.size));
    return Array.from(sizes);
  }, []);

  const availableColors = useMemo(() => {
    const colors = new Set(storeProducts.map((p) => p.color));
    return Array.from(colors);
  }, []);

  const filteredProducts = useMemo(() => {
    return storeProducts.filter((product) => {
      const materialMatch =
        filters.materials.length === 0 || filters.materials.includes(product.material);
      const sizeMatch =
        filters.sizes.length === 0 || filters.sizes.includes(product.size);
      const colorMatch =
        filters.colors.length === 0 || filters.colors.includes(product.color);
      const price = parseFloat(product.price);
      const priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1];
      return materialMatch && sizeMatch && colorMatch && priceMatch;
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCloseFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  return (
    <div className={styles.storePage}>
      <div className={styles.storePage__header}>
        <div className={styles.storePage__filterWrapper}>
          <button
            type="button"
            className={`${styles.storePage__filterButton} ${isFilterOpen ? styles['storePage__filterButton--open'] : ''}`}
            onClick={() => setIsFilterOpen((prev) => !prev)}
            aria-label={isFilterOpen ? 'Close filters' : 'Filters'}
          >            
            <img
              src="img/icons/Arrow-right-light.svg"
              alt="Toggle filters"
              aria-hidden="true"
              className={isFilterOpen ? styles.storePage__filterIconOpen : styles.storePage__filterIcon}
            />
          </button>

          <span className={styles.storePage__filterLabel}>
            {isFilterOpen ? 'Close filters' : 'Filters'}
          </span>

          <ProductFilter
            filters={filters}
            materials={availableMaterials}
            sizes={availableSizes}
            colors={availableColors}
            onFilterChange={handleFilterChange}
            isOpen={isFilterOpen}
            onClose={handleCloseFilter}
          />
        </div>
      </div>

      <div className={styles.storePage__container}>
        <div className={styles.storePage__content}>
          {displayedProducts.length > 0 ? (
            <>
              <div className={styles.storePage__products}>
                {displayedProducts.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <ProductCard
                      product={product}
                      buttonVariant="secondary"
                      variant="store"
                      detailPath={`/store/${product.id}`}
                    />
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className={styles.storePage__empty}>
              <p className={styles.storePage__emptyText}>No products found matching your filters.</p>
              <button
                type="button"
                className={styles.storePage__resetButton}
                onClick={() => handleFilterChange({ sizes: [], materials: [], priceRange: [0, 100], colors: [] })}
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
