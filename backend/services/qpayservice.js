// services/qpayService.js
import axios from 'axios';

const QPAY_USER = 'your_username';
const QPAY_PASS = 'your_password';
const INVOICE_CODE = 'your_invoice_code';

let accessToken = '';

export async function getToken() {
  const res = await axios.post('https://merchant.qpay.mn/v2/auth/token', {
    username: QPAY_USER,
    password: QPAY_PASS
  });
  accessToken = res.data.access_token;
}

export async function createInvoice({ amount, orderId }) {
  if (!accessToken) await getToken();

  const res = await axios.post(
    'https://merchant.qpay.mn/v2/invoice',
    {
      invoice_code: INVOICE_CODE,
      sender_invoice_no: orderId,
      invoice_receiver_code: 'terminal',
      invoice_description: `Захиалга #${orderId}`,
      amount,
      callback_url: 'https://yourdomain.mn/callback',
      due_date: '2025-06-30 23:59:59'
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return res.data;
}
