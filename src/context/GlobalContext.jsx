import React, { createContext, useContext, useReducer } from "react";

const GlobalContext = createContext();

// ---------------------------
// INITIAL STATE
// ---------------------------
const initialState = {
  cart: [],
};

// ---------------------------
// ACTION TYPES
// ---------------------------
const ADD_TO_CART = "ADD_TO_CART";
const REMOVE_FROM_CART = "REMOVE_FROM_CART";
const UPDATE_QTY = "UPDATE_QTY";
const CLEAR_CART = "CLEAR_CART";
const SET_CART = "SET_CART";

// ---------------------------
// REDUCER
// ---------------------------
function reducer(state, action) {
  switch (action.type) {

    case SET_CART:
      return { ...state, cart: action.payload || [] };

    case ADD_TO_CART: {
      const p = action.payload;

      const exists = state.cart.find(
        (item) => item._id === p._id && item.size === p.size
      );

      if (exists) {
        if (exists.qty >= exists.maxStock) {
          alert(`Only ${exists.maxStock} available for size ${p.size}`);
          return state;
        }

        return {
          ...state,
          cart: state.cart.map((item) =>
            item._id === p._id && item.size === p.size
              ? { ...item, qty: item.qty + 1 }
              : item
          ),
        };
      }

      return {
        ...state,
        cart: [...state.cart, { ...p, qty: 1 }],
      };
    }

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(
          (item) =>
            !(item._id === action.payload._id && item.size === action.payload.size)
        ),
      };

    case UPDATE_QTY: {
      const { _id, size, qty } = action.payload;

      const item = state.cart.find(
        (p) => p._id === _id && p.size === size
      );

      if (!item) return state;

      if (qty <= 0) {
        return {
          ...state,
          cart: state.cart.filter(
            (p) => !(p._id === _id && p.size === size)
          ),
        };
      }

      if (qty > item.maxStock) {
        alert(`Only ${item.maxStock} available for size ${size}`);
        return state;
      }

      return {
        ...state,
        cart: state.cart.map((p) =>
          p._id === _id && p.size === size ? { ...p, qty } : p
        ),
      };
    }

    case CLEAR_CART:
      return { ...state, cart: [] };

    default:
      return state;
  }
}

// ---------------------------
// PROVIDER
// ---------------------------
export function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addToCart = (product) =>
    dispatch({ type: ADD_TO_CART, payload: product });

  const removeFromCart = (_id, size) =>
    dispatch({ type: REMOVE_FROM_CART, payload: { _id, size } });

  const updateQty = (_id, size, qty) =>
    dispatch({ type: UPDATE_QTY, payload: { _id, size, qty } });

  const clearCart = () => dispatch({ type: CLEAR_CART });

  // ---------------------------
  // RESTORE CART FROM BACKEND
  // ---------------------------
  const setCartFromBackend = (cartData) => {
    if (!cartData || !cartData.items) {
      dispatch({ type: SET_CART, payload: [] });
      return;
    }

    const formatted = cartData.items.map((item) => {
      const sizeInfo = item.productId.sizes.find(
        (s) => s.size === item.size
      );

      return {
        _id: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        size: item.size,
        qty: item.quantity,
        maxStock: sizeInfo?.stock || 0,
      };
    });

    dispatch({ type: SET_CART, payload: formatted });
  };

  const totalItems = state.cart.reduce((sum, p) => sum + p.qty, 0);
  const totalPrice = state.cart.reduce((sum, p) => sum + p.qty * p.price, 0);

  return (
    <GlobalContext.Provider
      value={{
        cart: state.cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        setCartFromBackend,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => useContext(GlobalContext);
