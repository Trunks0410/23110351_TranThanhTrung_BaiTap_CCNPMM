import { Form, Input, Button, message, Card } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from '../util/axios';

const ForgotPassword = () => {
    const onFinish = async (values) => {
        try {
            const res = await axios.post('/forgot-password', values);
            message.success(res.data.message);
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to send reset email');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card title="Forgot Password" style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Form
                    name="forgot_password"
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
                        <Input prefix={<MailOutlined />} placeholder="Enter your email" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Send Reset Link
                        </Button>
                    </Form.Item>
                    
                    <div style={{ textAlign: 'center' }}>
                        <Link to="/">Back to Register</Link>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
