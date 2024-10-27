import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Fixed imports
import { Input, Button, Form, Message, Link, Space } from '@arco-design/web-react';
import { HelloWorld } from '../components/HelloWorld';
import axiosInstance from '../api/axios';

function Login () {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    try {
      const response = await axiosInstance.post('/admin/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        // 保存或处理token，例如保存到localStorage
        localStorage.setItem('token', response.data.token);
        Message.success('Login successful');
        navigate('/dashboard'); // Navigate to dashboard on success
      }
    } catch (error) {
      // 处理登录失败情况
      if (error.response && error.response.status === 400) {
        Message.error('Invalid input');
      } else {
        Message.error('Login failed, please try again.');
      }
    }
  };

  return (
        <div style={{
          maxWidth: '400px',
          margin: '100px auto',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Login</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Item label="Email">
                    <Input
                        placeholder="Please enter your email"
                        value={email}
                        onChange={(e) => setEmail(e)}
                        name="email"
                    />
                </Form.Item>
                <Form.Item label="Password">
                    <Input.Password
                        placeholder="Please enter your password"
                        value={password}
                        onChange={(e) => setPassword(e)}
                        name={'password'}
                    />
                </Form.Item>
                <Space direction={'vertical'}>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} name={'login'}>
                        Login
                    </Button>
                    <div style={{ textAlign: 'center' }}>
                        Don&apos;t have an account? <Link onClick={() => navigate('/register')} name={'toRegister'}>Click here to
                        register.</Link>
                    </div>
                </Space>
            </Form>
            <HelloWorld text="12311231231231323" />
        </div>
  );
}

export default Login;
