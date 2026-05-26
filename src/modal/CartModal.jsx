import React from 'react';
import './CartModal.css';

const CartModal = ({ cart, onClose, onRemove, onIncrement, onDecrement }) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="cart-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="cart-modal">
                <div className="cart-modal-header">
                    <h2 className="cart-modal-title">Корзина</h2>
                    <button className="cart-modal-close" onClick={onClose} title="Закрыть">✕</button>
                </div>

                {cart.length === 0 ? (
                    <p className="cart-empty">Корзина пуста</p>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img className="cart-item-image" src={item.image} alt={item.title} />
                                <div className="cart-item-info">
                                    <p className="cart-item-title">{item.title}</p>
                                    <span className="cart-item-price">{item.price * item.quantity} {item.currency}</span>
                                </div>
                                <div className="cart-item-controls">
                                    <button className="cart-qty-btn" onClick={() => onDecrement(item.id)}>−</button>
                                    <span className="cart-qty">{item.quantity}</span>
                                    <button className="cart-qty-btn" onClick={() => onIncrement(item.id)}>+</button>
                                    <button className="cart-remove-btn" onClick={() => onRemove(item.id)} title="Удалить">✕</button>
                                </div>
                            </div>
                        ))}
                        <div className="cart-total">
                            <span>Итого:</span>
                            <span>{total} {cart[0]?.currency}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartModal;