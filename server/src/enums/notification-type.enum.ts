export enum NotificationType {
  // Order-Related Notifications
  Order = 'Order',
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
