import ICartItem from "./ICartItem";

export default interface IPayment {
    state: {
        apiResult: {
            id: number;
            cartItems: ICartItem[];
            cartTotal: number;
            userId: string;
            stripePaymentIntentId: string;
            status: number;
        },
        userInput: {
            name: string;
            phone: string;
        }
    }
}