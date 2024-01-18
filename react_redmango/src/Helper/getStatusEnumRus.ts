import { Status_Constant } from "../Utility/Constant";

const getStatusEnumRus = (status_enum:Status_Constant) => {
    let enum_rus = '';
    switch(status_enum){
        case Status_Constant.BEING_COOKED : return 'Подготовка';
        case Status_Constant.CANCELLED: return 'Отменено';
        case Status_Constant.COMPLETED: return 'Завершено';
        case Status_Constant.CONFIRMED: return 'Подтверждено';
        case Status_Constant.PENDING: return 'В подтверждении';
        case Status_Constant.READY_FOR_PICKUP: return 'Готово к покупке';
        default: return 'Все';
    }
}

export default getStatusEnumRus;