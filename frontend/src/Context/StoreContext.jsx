// StoreContextProvider.js
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL, CURRENCY, DELIVERY_CHARGE } from "../../../utils"; // Import from utils.js

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(`${BACKEND_URL}/api/cart/add`, { itemId }, { headers: { token } });
        }
    };

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(`${BACKEND_URL}/api/cart/remove`, { itemId }, { headers: { token } });
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            try {
              if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }  
            } catch (error) {
                // Handle potential error, like missing data for the item
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(`${BACKEND_URL}/api/food/list`);
        setFoodList(response.data.data);
    };

    const loadCartData = async (token) => {
        const response = await axios.post(`${BACKEND_URL}/api/cart/get`, {}, { headers: token });
        setCartItems(response.data.cartData);
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData({ token: localStorage.getItem("token") });
            }
        }
        loadData();
    }, []);

    const contextValue = {
        BACKEND_URL,          // Now referencing from utils.js
        food_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        CURRENCY,             // Now referencing from utils.js
        DELIVERY_CHARGE       // Now referencing from utils.js
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
}

export default StoreContextProvider;
