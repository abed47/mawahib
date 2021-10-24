import AuthProvider from './auth';
import LayoutProvider from './layout';

const MainProvider = ({children}) => {
    return (
        <AuthProvider>
            <LayoutProvider>
                {children}
            </LayoutProvider>
        </AuthProvider>
    );
}

export default MainProvider;