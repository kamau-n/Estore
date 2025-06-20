export type payment = {
  id: string;
  product: string;
  orderId: string;
  channel: string;
  currency: string;
  customer: string;
  reference: string;
  paidAt: Date;
  userId: string;
  amount: string;
  status: string;
  createdAt: Date;
  refundedAt: Date;
  paymentFor: string;
  logs: {};
  user: {};
  authorization: {};
  paymentReference: string;
};

export type orderData = {
  userId: string;
  items: string;
  total: string;
  shippingInfo: shippingInfo;
  status: string;
  paymentStatus: string;
  createdAt: Date;
};

export type shippingInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
};
