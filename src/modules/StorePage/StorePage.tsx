import { useState, useMemo, useCallback } from 'react';
import { ProductCard, type Product } from '../../components/ProductCard';
import { ProductFilter, type FilterOptions } from '../../components/ProductFilter';
import { Pagination } from '../../components/Pagination';
import styles from './StorePage.module.scss';

const storeProducts: Product[] = [
  { id: 1, image: '/img/mainPic/description-1.png', name: 'Moonlight', material: 'sateen', price: '12.5$' },
  { id: 2, image: '/img/mainPic/description-2.png', name: 'Morning dew', material: 'sateen', price: '14$' },
  { id: 3, image: '/img/mainPic/mainPillow.png', name: 'Lavender dreams', material: 'sateen', price: '13.5$' },
  { id: 4, image: '/img/mainPic/description-1.png', name: 'Silence of the Carpathians', material: 'cotton', price: '12$' },
  { id: 5, image: '/img/mainPic/description-2.png', name: 'Starry blanket', material: 'cotton', price: '12.5$' },
  { id: 6, image: '/img/mainPic/mainPillow.png', name: 'Sunny field', material: 'linen', price: '12.5$' },
  { id: 7, image: '/img/mainPic/description-1.png', name: 'Ocean waves', material: 'sateen', price: '15$' },
  { id: 8, image: '/img/mainPic/description-2.png', name: 'Forest dreams', material: 'cotton', price: '13$' },
  { id: 9, image: '/img/mainPic/mainPillow.png', name: 'Sky blue', material: 'linen', price: '14.5$' },
  { id: 10, image: '/img/mainPic/description-1.png', name: 'Rose garden', material: 'sateen', price: '16$' },
  { id: 11, image: '/img/mainPic/description-2.png', name: 'Sunset glow', material: 'cotton', price: '13.5$' },
  { id: 12, image: '/img/mainPic/mainPillow.png', name: 'Golden hour', material: 'linen', price: '15$' },
];

const ITEMS_PER_PAGE = 6;

export const StorePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    materials: [],
    priceRange: [0, 100],
  });

  const availableMaterials = useMemo(() => {
    const materials = new Set(storeProducts.map((p) => p.material));
    return Array.from(materials).sort();
  }, []);

  const filteredProducts = useMemo(() => {
    return storeProducts.filter((product) => {
      const materialMatch =
        filters.materials.length === 0 || filters.materials.includes(product.material);
      const price = parseFloat(product.price);
      const priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1];
      return materialMatch && priceMatch;
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
            aria-label={isFilterOpen ? "Close filters" : "Open filters"}
          >
            <span>{isFilterOpen ? "Close filters" : "Open filters"}</span>
            <img
              src="/img/icons/Arrow-right-light.svg"
              alt="Toggle filters"
              aria-hidden="true"
              className={isFilterOpen ? styles.storePage__filterIconOpen : styles.storePage__filterIcon}
            />
          </button>

          <ProductFilter
            filters={filters}
            materials={availableMaterials}
            onFilterChange={handleFilterChange}
            isOpen={isFilterOpen}
            onClose={handleCloseFilter}
          />
        </div>

        <div className={styles.storePage__stats}>
          <span className={styles.storePage__count}>{filteredProducts.length} products</span>
        </div>
      </div>

      <div className={styles.storePage__container}>

        <div className={styles.storePage__content}>
          {displayedProducts.length > 0 ? (
            <>
              <div className={styles.storePage__products}>
                {displayedProducts.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <ProductCard product={product} buttonVariant="secondary" variant="store" />
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
              <p>No products found matching your filters.</p>
              <button
                type="button"
                className={styles.storePage__resetButton}
                onClick={() => handleFilterChange({ materials: [], priceRange: [0, 100] })}
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
