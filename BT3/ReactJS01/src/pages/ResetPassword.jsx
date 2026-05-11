import { Form, Input, Button, message, Card } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../util/axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const res = await axios.post(`/reset-password/${token}`, values);
            message.success(res.data.message);
            navigate('/');
        } catch (error) {
            message.error(error.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' }}>
            <Card title="Reset Password" style={{ width: 400, boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <Form
                    name="reset_password"
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="password"
                        label="New Password"
                        rules={[{ required: true, message: 'Please input your new Password!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="New Password" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm New Password"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your new Password!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Confirm New Password" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ResetPassword;
