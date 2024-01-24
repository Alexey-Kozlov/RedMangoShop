import { checkToken } from "../Helper";

const Auth = (WrappedComponent: any) => {
    return (props: any) => {
        const accessToken = localStorage.getItem('RM_Token');
        if(!accessToken){
            window.location.replace('/login');
            return null;
        }
        if(!checkToken()){
            window.location.replace('/login');
            return null;
        }
        return <WrappedComponent {...props} />;
    }
}

export default Auth;