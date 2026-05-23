import React, { useState } from 'react';
import ProductFilter from './ProductFilter';
import ProductCard from './ProductCard';
import './ProductCatalog.css';

const filterConfig = {
    sort: {
        name: 'sort',
        label: 'Сортировка',
        defaultValue: 'default',
        options: [
            { value: 'default', label: 'По умолчанию' },
            { value: 'price-ascending', label: 'Сначала дешевле' },
            { value: 'price-descending', label: 'Сначала дороже' },
        ],
    },
    inStock: {
        name: 'inStock',
        label: 'Только в наличии',
        defaultValue: false,
    },
    onSale: {
        name: 'onSale',
        label: 'Акционные товары',
        defaultValue: false,
    },
    minPrice: {
        name: 'minPrice',
        label: 'Цена от',
        defaultValue: 0,
    },
    maxPrice: {
        name: 'maxPrice',
        label: 'Цена до',
        defaultValue: 0,
    },
    minRating: {
        name: 'minRating',
        label: 'Рейтинг от',
        defaultValue: 0,
    },
};

const filtersInitial = {
    sort: filterConfig.sort.defaultValue,
    inStock: filterConfig.inStock.defaultValue,
    onSale: filterConfig.onSale.defaultValue,
    minPrice: filterConfig.minPrice.defaultValue,
    maxPrice: filterConfig.maxPrice.defaultValue,
    minRating: filterConfig.minRating.defaultValue,
};

const getFilteredProducts = (products, filters) => {
    const filtered = products.filter((p) => {
        if (filters.inStock && !p.inStock) return false;
        if (filters.onSale && !p.oldPrice && !p.discount) return false;
        if (filters.minPrice && p.price < filters.minPrice) return false;
        if (filters.maxPrice && p.price > filters.maxPrice) return false;
        if (filters.minRating && p.rating < filters.minRating) return false;
        return true;
    });

    if (filters.sort === 'price-ascending') return filtered.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-descending') return filtered.sort((a, b) => b.price - a.price);

    return filtered;
};

const ProductCatalog = ({ products }) => {
    const [filters, setFilters] = useState(filtersInitial);

    const changeFilter = (name, value) => {
        setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
    };

    const resetFilters = () => setFilters(filtersInitial);

    const filteredProducts = getFilteredProducts(products, filters);

    const onAddToCart = (id) => {
        alert(`Товар ${id} добавлен в корзину!`);
    };

    return (
        <div className="catalog-layout">
            <ProductFilter
                filterConfig={filterConfig}
                filters={filters}
                changeFilter={changeFilter}
                resetFilters={resetFilters}
            />
            <div className="catalog-main">
                <div className="catalog-results-count">
                    Найдено: {filteredProducts.length} товаров
                </div>
                <div className="products-catalog">
                    {
                        filteredProducts.length === 0 ? (<p className="no-results">Товары не найдены</p>) : 
                        (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    onAddToCart={onAddToCart}
                                />
                            ))
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default ProductCatalog;