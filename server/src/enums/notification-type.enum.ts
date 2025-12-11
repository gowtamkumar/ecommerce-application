export enum NotificationType {
  // Order-Related Notifications
  Order = 'Order', // General fallback
  OrderPlaced = 'OrderPlaced',
  OrderShipped = 'OrderShipped',
  OrderDelivered = 'OrderDelivered',
  OrderCanceled = 'OrderCanceled',
  AdminNewOrder = 'ADMIN_NEW_ORDER',
  AdminPaymentFailed = 'ADMIN_PAYMENT_FAILED',
  AdminOrderCanceled = 'ADMIN_ORDER_CANCELED',
  AdminLowStock = 'ADMIN_LOW_STOCK',
  AdminHighValueOrder = 'ADMIN_HIGH_VALUE_ORDER',
  PromotionalMarketing = 'PromotionalMarketing',
  UserAccount = 'UserAccount',
  ReviewFeedback = 'ReviewFeedback',
  CustomerSupport = 'CustomerSupport',
  WishlistSubscription = 'WishlistSubscription',
  
  // Custom User Notifications
  UserRegistration = 'UserRegistration',
  UserLogin = 'UserLogin',
  PasswordChanged = 'PasswordChanged',
  ForgotPassword = 'ForgotPassword',
  NewsletterSubscription = 'NewsletterSubscription',
  Verification = 'Verification',
  // Admin Notifications
  AdminNewUser = 'ADMIN_NEW_USER',
  AdminSecurityAlert = 'ADMIN_SECURITY_ALERT',
}
