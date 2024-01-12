export default interface IResponse {
    data?:{
        statusCode: number;
        isSuccess: boolean;
        errorMessages: Array<string>;
        result: {
            [key:string]:string;
        };
    };
    error?: any;
};
