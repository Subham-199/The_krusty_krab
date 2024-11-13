import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import { BACKEND_URL } from '../../../utils'; // Import BACKEND_URL from utils.js
import './Verify.css';

const Verify = () => {
  const { url } = useContext(StoreContext); // You can now remove this line as it's no longer needed
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const navigate = useNavigate();

  const verifyPayment = async () => {
    const response = await axios.post(`${BACKEND_URL}/api/order/verify`, { success, orderId });
    if (response.data.success) {
      navigate("/myorders");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
