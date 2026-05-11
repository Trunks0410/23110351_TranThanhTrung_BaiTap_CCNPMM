import { createContext, useState } from 'react';

export const AuthContext = createContext({
    auth: {
        isAuthenticated: false,
        user: {
            email: "",
            name: ""
        }
    },
    setAuth: () => {}
});

export const AuthWrapper = (props) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            email: "",
            name: ""
        }
    });

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    );
};
