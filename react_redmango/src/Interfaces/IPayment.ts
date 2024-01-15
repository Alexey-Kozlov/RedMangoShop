import { Status_Constant } from "../Utility/Constant";
import ICartItem from "./ICartItem";

export default interface IPayment {
    state: {
        apiResult: {
            id: number;
            cartItems: ICartItem[];
            cartTotal: number;
            userId: string;
            stripePaymentIntentId: string;
            status: Status_Constant;
        },
        userInput: {
            name: string;
            phone: string;
        }
    }
}