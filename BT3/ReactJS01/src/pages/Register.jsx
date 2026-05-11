import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../util/axios';

const Register = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await axios.post('/register', values);
            message.success(res.data.message);
            // In a real app, you might navigate to login, but we only have 2 flows
            navigate('/forgot-password');
        } catch (error) {
            message.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card title="Register" style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please input your Email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Register
                        </Button>
                    </Form.Item>
                    
                    <div style={{ textAlign: 'center' }}>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default Register;
