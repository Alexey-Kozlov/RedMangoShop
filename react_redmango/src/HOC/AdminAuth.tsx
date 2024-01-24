import { jwtDecode } from 'jwt-decode';
import { Roles_Constant } from '../Utility/Constant';
import { checkToken } from '../Helper';

const AdminAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const accessToken = localStorage.getItem('RM_Token');
        if (!accessToken) {
            window.location.replace('/login');
            return null;
        }
        if(!checkToken()) return null;

        const decode: { role: string } = jwtDecode(accessToken);
        if (decode.role != Roles_Constant.ADMIN) {
            window.location.replace('/accessDenied');
            return null;
        }

        return <WrappedComponent {...props} />;
    }
}

export default AdminAuth;