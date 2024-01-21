import IMenuItem from "./IMenuItem";

export default interface ICartItem {
    id: number;
    menuItemId: number;
    menuItem: IMenuItem;
    quantity: number;
  }