export const ActionType = {
  VIEW: 'VIEW',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  APPROVE: 'APPROVE',
  CLOSE: 'CLOSE',
}


// We will use the strings directly since sharing enums might be tricky if not set up
export const NOTIFICATION_TYPES = [
  'Order', 'OrderPlaced', 'OrderShipped', 'OrderDelivered', 'OrderCanceled',
  'AdminNewOrder', 'AdminPaymentFailed', 'AdminOrderCanceled', 'AdminLowStock', 'AdminHighValueOrder',
  'PromotionalMarketing', 'NewOffer', 'ReviewRequest', 'ReviewSubmitted',
  'SystemAlert', 'ServerDown', 'HighTraffic', 'PaymentGatewayError', 'SmsEmailFailed', 'CronJobFailed',
  'UserAccount', 'UserRegistration', 'UserLogin'
];

// Payment method
export const paymentMethods = [
    { value: "Cash", label: "Cash on Delivery", description: "Pay when you receive" },
    { value: "SSLCOMMERZ", label: "Online Payment", description: "Cards, Mobile Banking, Net Banking" },
  ];