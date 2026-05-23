import React from 'react';
import classNames from 'classnames';
import './ProductFilter.css';

const ProductFilter = ({ filterConfig, filters, changeFilter, resetFilters }) => {
    const hasActiveFilters =
        filters.sort !== filterConfig.sort.defaultValue ||
        filters.inStock !== filterConfig.inStock.defaultValue ||
        filters.onSale !== filterConfig.onSale.defaultValue ||
        filters.minPrice !== filterConfig.minPrice.defaultValue ||
        filters.maxPrice !== filterConfig.maxPrice.defaultValue ||
        filters.minRating !== filterConfig.minRating.defaultValue;

    return (
        <div className="product-filter">
            <div className="filter-header">
                <h3 className="filter-title">Фильтры</h3>
                {hasActiveFilters && (
                    <button className="filter-reset-btn" onClick={resetFilters}>
                        Сбросить
                    </button>
                )}
            </div>

            <div className="filter-section">
                <p className="filter-section-label">Сортировка</p>
                <div className="filter-sort-group">
                    {filterConfig.sort.options.map((option) => (
                        <button
                            key={option.value}
                            className={classNames('filter-sort-btn', { active: filters.sort === option.value })}                   
                            onClick={() => changeFilter(filterConfig.sort.name, option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="filter-section">
                <p className="filter-section-label">Статус</p>
                <label className="filter-checkbox-label">
                    <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={filters.inStock}
                        onChange={(e) => changeFilter(filterConfig.inStock.name, e.target.checked)}
                    />
                    <span className="filter-checkbox-text">{filterConfig.inStock.label}</span>
                </label>
                <label className="filter-checkbox-label">
                    <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={filters.onSale}
                        onChange={(e) => changeFilter(filterConfig.onSale.name, e.target.checked)}
                    />
                    <span className="filter-checkbox-text">{filterConfig.onSale.label}</span>
                </label>
            </div>

            <div className="filter-section">
                <p className="filter-section-label">Цена</p>
                <div className="filter-price-row">
                    <input
                        type="number"
                        className="filter-price-input"
                        placeholder='От'                    
                        value={filters.minPrice || ''}
                        onChange={(e) => changeFilter(filterConfig.minPrice.name, Number(e.target.value))}
                    />
                    <span className="filter-price-dash">-</span>
                    <input
                        type="number"
                        className="filter-price-input"
                        placeholder='До'
                        value={filters.maxPrice || ''}
                        onChange={(e) => changeFilter(filterConfig.maxPrice.name, Number(e.target.value))}
                    />
                </div>
            </div>

            <div className="filter-section">
                <p className="filter-section-label">Рейтинг от</p>
                <div className="filter-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={classNames('filter-star-btn', { active: filters.minRating >= star })}
                            onClick={() => changeFilter(filterConfig.minRating.name, filters.minRating === star ? 0 : star)}
                            aria-label={`Рейтинг от ${star}`}
                        >
                            ★
                        </button>
                    ))}
                    {filters.minRating > 0 && (
                        <span className="filter-star-hint">и выше</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;