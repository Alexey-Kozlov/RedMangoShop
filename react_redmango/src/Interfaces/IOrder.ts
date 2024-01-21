import IMenuItem from "./IMenuItem";

export default interface IOrder {
    orderDetailId: number;
    orderHeaderId: number;
    menuItemId: number;
    menuItem: IMenuItem;
    quantity: number;
    itemName: string;
    price: number;
}