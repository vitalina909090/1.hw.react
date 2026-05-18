import React from 'react';
import Badge from './Badge';
import Price from './Price';
import Rating from './Rating';
import './ProductCard.css';
import classNames from 'classnames';

const ProductCard = ({
    id,
    title,
    price,
    oldPrice,
    currency,
    image,
    rating,
    inStock,
    discount,
    badges,
    onAddToCart
}) => {
    return (
        <div className={classNames('product-card', { 'out-of-stock': !inStock })}>
            <Badge badges={badges} />

            <div className="image">
                <img src={image} alt={title} />
            </div>

            <div className="product-info">
                <h3 className="title">{title}</h3>

                <Rating rating={rating} />

                <Price price={price} oldPrice={oldPrice} discount={discount} currency={currency} />

                <button className="add-to-cart-btn" disabled={!inStock} onClick={() => onAddToCart(id)}>
                    {inStock ? 'В корзину' : 'Нет в наличии'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;