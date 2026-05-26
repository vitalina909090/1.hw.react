import React, { useState, useReducer } from 'react';
import ProductFilter from './ProductFilter/ProductFilter';
import ProductCard from './ProductCard/ProductCard';
import CartModal from '../../modal/CartModal';
import { cartReducer, loadCartFromStorage, CartAction } from '../../reducers/CartReducer';
import './ProductCatalog.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    inStock: { name: 'inStock', label: 'Только в наличии', defaultValue: false },
    onSale: { name: 'onSale', label: 'Акционные товары', defaultValue: false },
    minPrice: { name: 'minPrice', label: 'Цена от', defaultValue: 0 },
    maxPrice: { name: 'maxPrice', label: 'Цена до', defaultValue: 0 },
    minRating: { name: 'minRating', label: 'Рейтинг от', defaultValue: 0 },
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
    const [cartOpen, setCartOpen] = useState(false);
    const [cart, dispatch] = useReducer(cartReducer, [], loadCartFromStorage);

    const changeFilter = (name, value) => {
        setFilters((current) => ({ ...current, [name]: value }));
    };

    const filteredProducts = getFilteredProducts(products, filters);
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <button className="cart-fab" onClick={() => setCartOpen(true)} title="Корзина">
                <i className="bi bi-bag"></i>
                {totalCount > 0 && <span className="cart-fab-count">{totalCount}</span>}
            </button>
            <div className="catalog-layout">
                <ProductFilter
                    filterConfig={filterConfig}
                    filters={filters}
                    changeFilter={changeFilter}
                    resetFilters={() => setFilters(filtersInitial)}
                />
                <div className="catalog-main">
                    <div className="catalog-results-count">Найдено: {filteredProducts.length} товаров</div>
                    <div className="products-catalog">
                        {filteredProducts.length === 0 ? (
                            <p className="no-results">Товары не найдены</p>
                        ) : (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    {...product}
                                    onAddToCart={(product) => dispatch({ type: CartAction.CART_ADD_ITEM, product })}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            {cartOpen && (
                <CartModal
                    cart={cart}
                    onClose={() => setCartOpen(false)}
                    onRemove={(id) => dispatch({ type: CartAction.CART_REMOVE_ITEM, id })}
                    onIncrement={(id) => dispatch({ type: CartAction.CART_INCREMENT_ITEM, id })}
                    onDecrement={(id) => dispatch({ type: CartAction.CART_DECREMENT_ITEM, id })}
                />
            )}
        </>
    );
};

export default ProductCatalog;