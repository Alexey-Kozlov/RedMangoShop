import ICartItem from "./ICartItem";

export default interface IShoppingCart {
    id?: number;
    userId?: string;
    cartItems?: ICartItem[];
    cartTotal?: number;
    stripePaymentIntentId?: string;
    clientSecret?: string
  }