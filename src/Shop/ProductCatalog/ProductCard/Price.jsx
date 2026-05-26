import React from 'react';
import classNames from 'classnames';

const Price = ({ price, oldPrice, discount, currency }) => {
    const isPromo = Boolean(oldPrice || discount);
    return (
        <div className="price">
            {isPromo && (
                <span className="price-old">
                    {oldPrice} {currency}
                </span>
            )}
            <span className={classNames('price-current', { 'price-bold': isPromo })}>
                {price} {currency}
            </span>
        </div>
    );
}

export default Price;
