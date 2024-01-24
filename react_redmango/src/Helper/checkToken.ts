import { jwtDecode } from 'jwt-decode';

const checkToken = (): boolean =>{
    const accessToken = localStorage.getItem('RM_Token');
    if (!accessToken) {
        return false;
    }

    const decode: { exp: number } = jwtDecode(accessToken);
    if(decode.exp * 1000 <= Date.now()){
        localStorage.removeItem("RM_Token");
        return false;
    }

    return true;
}

export default checkToken;