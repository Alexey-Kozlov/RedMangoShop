import IOrder from "./IOrder";

export default interface IOrderHeader {
    orderHeaderId: number;
    name: string;
    phone: string;
    applicationUserId: string;
    orderTotal: number;
    orderDate: Date;
    stripePaymentIntentId: string;
    status: number;
    totalItems: number;
    orderDetails: IOrder[];
}