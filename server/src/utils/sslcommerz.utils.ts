import { UserEntity } from '@/modules/user/auth/model/user.entity';

interface PaymentData {
  tranId: string;
  amount: number;
  user: UserEntity;
  productProfile?: string;
  shippingMethod?: string;
}

export const initiateSSLCommerzPayment = async (data: PaymentData): Promise<string> => {
  console.log('data', data);

  const store_id = process.env.STORE_ID;
  const store_passwd = process.env.STORE_PASSWD;
  const is_live = process.env.IS_LIVE === 'true'; // Ensure boolean
  const BACK_END_URL = process.env.BACK_END_URL;

  const apiUrl = is_live
    ? 'https://securepay.sslcommerz.com/gwprocess/v4/api.php'
    : 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

  const paymentPayload = {
    total_amount: data.amount,
    currency: 'BDT',
    tran_id: data.tranId,
    success_url: `${BACK_END_URL}/payments/success/${data.tranId}`,
    fail_url: `${BACK_END_URL}/payments/fail/${data.tranId}`,
    cancel_url: `${BACK_END_URL}/payments/cancel/${data.tranId}`,
    ipn_url: `${BACK_END_URL}/payment-ipn/${data.tranId}`,

    shipping_method: data.shippingMethod || 'Courier',
    product_name: 'Order Payment',
    product_category: 'General',
    product_profile: data.productProfile || 'general',

    cus_name: data.user.name,
    cus_email: data.user.email,
    cus_add1: data.user.address || 'Dhaka',
    cus_city: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: data.user.phone || '01711111111',

    ship_name: data.user.name,
    ship_add1: data.user.address || 'Dhaka',
    ship_city: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };

  const formData = new URLSearchParams();
  formData.append('store_id', store_id || '');
  formData.append('store_passwd', store_passwd || '');

  Object.entries(paymentPayload).forEach(([key, value]) => {
    if (key !== 'store_id' && key !== 'store_passwd') {
      formData.append(key, String(value));
    }
  });

  const response = await fetch(apiUrl, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (result.status === 'SUCCESS' && result.GatewayPageURL) {
    return result.GatewayPageURL;
  } else {
    throw new Error(result.failedreason || 'No GatewayPageURL in SSLCommerz response');
  }
};
