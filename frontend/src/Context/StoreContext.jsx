import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";
import { BACKEND_URL } from '../../../utils'; 

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("");
    const currency = "₹";
    const deliveryCharge = 80;

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
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
                console.error("Error calculating total cart amount", error);
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        const response = await axios.get(`${BACKEND_URL}/api/food/list`);
        setFoodList(response.data.data);
    };

    const loadCartData = async (token) => {
        const response = await axios.post(`${BACKEND_URL}/api/cart/get`, {}, { headers: { token } });
        setCartItems(response.data.cartData);
    };

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

    const contextValue = {
        BACKEND_URL,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems,
        currency,
        deliveryCharge
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
