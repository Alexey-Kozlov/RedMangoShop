import { Status_Constant } from "../Utility/Constant";
import IOrder from "./IOrder";

export default interface IOrderHeader {
    orderHeaderId: number;
    name: string;
    phone: string;
    applicationUserId: string;
    orderTotal: number;
    orderDate: Date;
    stripePaymentIntentId: string;
    status: Status_Constant;
    totalItems: number;
    orderDetails: IOrder[];
}