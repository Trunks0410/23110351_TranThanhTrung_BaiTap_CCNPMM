import { useContext } from 'react';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LoginOutlined, LogoutOutlined, AppstoreOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/auth.context';

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
        // Optionally remove token from local storage if used
        navigate('/');
    };

    const items = [
        {
            label: <Link to="/">Home</Link>,
            key: 'home',
            icon: <AppstoreOutlined />,
        },
        ...(!auth.isAuthenticated ? [
            {
                label: <Link to="/">Register</Link>,
                key: 'register',
                icon: <UserOutlined />,
            },
            {
                label: <Link to="/forgot-password">Forgot Password</Link>,
                key: 'forgot',
                icon: <LoginOutlined />,
            }
        ] : [
            {
                label: <span onClick={handleLogout}>Logout</span>,
                key: 'logout',
                icon: <LogoutOutlined />,
            }
        ])
    ];

    return (
        <Menu mode="horizontal" items={items} />
    );
};

export default Header;
