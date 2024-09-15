// pages/_app.tsx
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { AuthProvider } from '../context/AuthContext'; // Corrected import of AuthProvider

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </Provider>
    );
}

export default MyApp;
