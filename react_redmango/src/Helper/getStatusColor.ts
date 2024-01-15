import { Status_Constant } from "../Utility/Constant";

const getStatusColor = (status: Status_Constant) => {
    let color_style: string = '';
    if(status === Status_Constant.CONFIRMED){
        color_style = 'primary';
    } else if(status === Status_Constant.PENDING){
        color_style = 'secondary';
    } else if (status === Status_Constant.CANCELLED){
        color_style = 'danger';
    } else if (status === Status_Constant.COMPLETED) {
        color_style = 'success';
    } else if (status === Status_Constant.BEING_COOKED) {
        color_style = 'info';
    } else {
        color_style = 'warning';
    }

    return color_style;
}

export default getStatusColor;