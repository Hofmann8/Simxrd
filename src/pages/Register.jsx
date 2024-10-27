import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios'; // Ensure correct path
import { Input, Button, Form, Message, Space, Link } from '@arco-design/web-react';

function Register () {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  
  const handleInputChange = (value, e) => {
    const { name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      Message.error("Passwords don't match.");
      return;
    }

    try {
      // API call for registration
      await axiosInstance.post('/admin/auth/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      Message.success('Registration successful');
      navigate('/login'); // Navigate to login on success
    } catch (error) {
      // Handle registration failure
      Message.error(error.response?.data?.error || 'Registration failed, please try again.');
    }
  };

  return (
        <div style={{ maxWidth: '500px', margin: '100px auto', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>Register</h2>
            <Form onSubmit={handleSubmit}>
                <Space direction="vertical">
                    <Form.Item label="Name">
                        <Input
                            name="name"
                            placeholder="Please enter your name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input
                            name="email"
                            type="email"
                            placeholder="Please enter your email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item label="Password">
                        <Input.Password
                            name="password"
                            placeholder="Please enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Form.Item label="Confirm Password">
                        <Input.Password
                            name="confirmPassword"
                            placeholder="Please confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} name={'register'}>
                        Register
                    </Button>
                    <div style={{ textAlign: 'center' }}>
                        Already have an account? <Link onClick={() => navigate('/login')} name={'toLogin'}>Click here to login.</Link>
                    </div>
                </Space>
            </Form>
        </div>
  );
}

export default Register;
