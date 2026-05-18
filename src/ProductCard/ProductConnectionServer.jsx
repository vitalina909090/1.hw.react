import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const ProductConnectionServer = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/products')
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error('Ошибка загрузки товаров:', err));
    }, []);

    const onAddToCart = (id) => {
        alert(`Товар ${id} добавлен в корзину!`);
    };

    return (
    <div className="products-catalog">
        {products.map((product) => (
            <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                oldPrice={product.oldPrice}
                currency={product.currency}
                image={product.image}
                rating={product.rating}
                inStock={product.inStock}
                discount={product.discount}
                badges={product.badges}
                onAddToCart={onAddToCart}
            />
        ))}
    </div>
  );
};

export default ProductConnectionServer;
