import { OrderPaymentMethod, PaymentStatus } from "../../enums";
import { OrderStatus } from "../../enums/order-status.enum";

export interface CreateOrderDto {
  orderDate?: string;

  isPaid: boolean;

  isShipped: boolean;

  orderTotalAmount: number;

  discountAmount?: number;

  netAmount: number;

  shippingAmount?: number;

  tax?: number;

  orderNote?: string;

  phoneNo: string;

  emailAddress?: string;

  shippingAddressId?: string;

  paymentStatus: PaymentStatus;

  paymentMothod: OrderPaymentMethod;

  status: OrderStatus;

  userId?: string;
}
