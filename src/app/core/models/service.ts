export interface ServiceItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResponseServices {
  msg: string;
  data: [ServiceItem];
}