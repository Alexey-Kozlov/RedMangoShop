export enum Roles_Constant {
    ADMIN = 'admin',
    CUSTOMER = 'customer'
}

export enum Status_Constant {
    PENDING = 0,
    CONFIRMED = 1,
    BEING_COOKED = 2,
    READY_FOR_PICKUP = 3,
    COMPLETED = 4,
    CANCELLED = 5
}

export enum Category_Constant {
    ВСЕ = 'Все',
    ОВОЩИ = 'Овощи',
    ФРУКТЫ = 'Фрукты',
    ХЛЕБ = 'Хлеб',
    МОЛОЧНЫЕ = 'Молочные продукты',
    МЯСО = 'Мясо',
    КРУПА = 'Крупа',
    МОРЕПРОДУКТЫ = 'Морепродукты'
}

export enum SortTypes_Constant {
    PRICE_LOW_HIGH = 'Цена, повышение',
    PRICE_HIGH_LOW = 'Цена, понижение',
    NAME_A_Z = 'Наименование, А - Я',
    NAME_Z_A = 'Наименование, Я - А'
}