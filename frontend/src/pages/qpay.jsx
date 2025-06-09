import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants.js';

function Qpay() {
  const location = useLocation();
  const { amount } = location.state || { amount: 0 };
  const [qrImage, setQrImage] = useState('');

  const handlePay = async () => {
    const response = await axios.post(`${BASE_URL}api/qpay/create-invoice`, {
      amount: amount,
      orderId: 'ORDER12345'
    });

    setQrImage(response.data.qr_image);
  };

  return (
    <div>
      <h1>QPay төлбөр</h1>
      <p>Таны төлбөрийн дүн: {amount}₮</p>
      <button onClick={handlePay}>Төлбөр хийх</button>
      {qrImage && (
        <div>
          <h2>Төлбөрийн QR:</h2>
          <img src={qrImage} alt="QPay QR" />
        </div>
      )}
    </div>
  );
}

export default Qpay;
