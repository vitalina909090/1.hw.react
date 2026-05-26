export const CartAction = {
    CART_ADD_ITEM: 'CART_ADD_ITEM',
    CART_REMOVE_ITEM: 'CART_REMOVE_ITEM',
    CART_INCREMENT_ITEM: 'CART_INCREMENT_ITEM',
    CART_DECREMENT_ITEM: 'CART_DECREMENT_ITEM',
};

export const loadCartFromStorage = () => {
    try {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
};

const saveCartToStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const cartReducer = (state, action) => {
    let nextState;

    switch (action.type) {
        case CartAction.CART_ADD_ITEM: {
            const alreadyInCart = state.find(item => item.id === action.product.id);
            if (alreadyInCart) {
                nextState = state.map(item =>
                    item.id === action.product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                nextState = [...state, { ...action.product, quantity: 1 }];
            }
            break;
        }

        case CartAction.CART_REMOVE_ITEM:
            nextState = state.filter(item => item.id !== action.id);
            break;

        case CartAction.CART_INCREMENT_ITEM:
            nextState = state.map(item =>
                item.id === action.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            break;

        case CartAction.CART_DECREMENT_ITEM:
            nextState = state
                .map(item =>
                    item.id === action.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter(item => item.quantity > 0);
            break;
        default:
            return state;
    }

    saveCartToStorage(nextState);
    return nextState;
};