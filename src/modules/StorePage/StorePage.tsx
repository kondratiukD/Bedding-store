import { useState, useMemo, useCallback, type ChangeEvent } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { ProductFilter, type FilterOptions } from '../../components/ProductFilter';
import { Pagination } from '../../components/Pagination';
import { storeProducts } from '../../data/products';
import styles from './StorePage.module.scss';

const ITEMS_PER_PAGE = 6;

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export const StorePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [filters, setFilters] = useState<FilterOptions>({
    sizes: [],
    materials: [],
    priceRange: [0, 50],
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

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];

    switch (sortOption) {
      case 'price-asc':
        return products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-desc':
        return products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'name-asc':
        return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return products.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage]);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value as SortOption);
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
            className={styles.storePage__filterButton}
            onClick={() => setIsFilterOpen(true)}
            aria-label="Open filters"
          >
            <span>{'>'}</span>
          </button>

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

        <div className={styles.storePage__stats}>
          <div className={styles.storePage__sortGroup}>
            <label htmlFor="sortOption" className={styles.storePage__sortLabel}>
              Sort by
            </label>
            <select
              id="sortOption"
              value={sortOption}
              onChange={handleSortChange}
              className={styles.storePage__sortSelect}
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name-asc">Name: A–Z</option>
              <option value="name-desc">Name: Z–A</option>
            </select>
          </div>
          <span className={styles.storePage__count}>{sortedProducts.length} products</span>
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
              <p>No products found matching your filters.</p>
              <button
                type="button"
                className={styles.storePage__resetButton}
                onClick={() => handleFilterChange({ sizes: [], materials: [], priceRange: [0, 50], colors: [] })}
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
