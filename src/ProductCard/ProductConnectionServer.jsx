import React, { useState, useEffect } from 'react';
import ProductCatalog from './ProductCatalog';

const ProductConnectionServer = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/products')
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error('Ошибка загрузки товаров:', err));
    }, []);

    return <ProductCatalog products={products} />;

};

export default ProductConnectionServer;
