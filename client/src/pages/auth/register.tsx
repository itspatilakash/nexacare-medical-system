import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  App, 
  Space, 
  Typography, 
  Divider,
  Row,
  Col,
  Steps
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MedicineBoxOutlined,
  UserAddOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

export default function Register() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleRegister = async (values: any) => {
    setIsLoading(true);
    try {
      // First, send OTP for verification
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: values.mobileNumber,
          role: values.role,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        message.success(`OTP sent to ${values.mobileNumber}`);
        console.log('Registration OTP:', data.otp);
        setCurrentStep(1);
      } else {
        message.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Registration error:', error);
      message.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    {
      title: 'Basic Info',
      description: 'Enter your details',
      icon: <UserOutlined />,
    },
    {
      title: 'OTP Verification',
      description: 'Verify your mobile',
      icon: <SafetyOutlined />,
    },
    {
      title: 'Complete',
      description: 'Account created',
      icon: <UserAddOutlined />,
    },
  ];

  return (
    <div className="medical-container">
      <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
        <Col xs={22} sm={18} md={12} lg={10} xl={8}>
          <Card className="medical-card" style={{ borderRadius: '12px' }}>
            <div className="medical-header" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <MedicineBoxOutlined style={{ fontSize: '32px', marginBottom: '16px' }} />
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                Join NexaCare
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                Create your medical account
              </Text>
            </div>

            <div className="medical-form">
              <Steps current={currentStep} items={steps} style={{ marginBottom: '32px' }} />

              {currentStep === 0 && (
                <Form
                  form={form}
                  name="register"
                  onFinish={handleRegister}
                  layout="vertical"
                  size="large"
                >
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[
                      { required: true, message: 'Please enter your full name' },
                      { min: 2, message: 'Name must be at least 2 characters' }
                    ]}
                  >
                <Input
                      prefix={<UserOutlined />}
                      placeholder="Enter your full name"
                      className="medical-input"
                    />
                  </Form.Item>

                  <Form.Item
                    name="mobileNumber"
                    label="Mobile Number"
                    rules={[
                      { required: true, message: 'Please enter your mobile number' },
                      { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit mobile number' }
                    ]}
                  >
                <Input
                      prefix={<PhoneOutlined />}
                      placeholder="Enter 10-digit mobile number"
                      className="medical-input"
                      maxLength={10}
                    />
                  </Form.Item>

                  <Form.Item
                    name="role"
                    label="I am a"
                    rules={[{ required: true, message: 'Please select your role' }]}
                  >
                    <Select
                      placeholder="Select your role"
                      className="medical-input"
                      size="large"
                    >
                      <Option value="patient">
                        <Space>
                          <UserOutlined />
                          Patient
                        </Space>
                      </Option>
                      <Option value="doctor">
                        <Space>
                          <MedicineBoxOutlined />
                          Doctor
                        </Space>
                      </Option>
                      <Option value="hospital">
                        <Space>
                          <MedicineBoxOutlined />
                          Hospital Admin
                        </Space>
                      </Option>
                      <Option value="lab">
                        <Space>
                          <MedicineBoxOutlined />
                          Lab Technician
                        </Space>
                      </Option>
                      <Option value="receptionist">
                        <Space>
                          <UserOutlined />
                          Receptionist
                        </Space>
                      </Option>
                </Select>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      className="medical-button-primary"
                      block
                      size="large"
                    >
                      Send OTP
                    </Button>
                  </Form.Item>
                </Form>
              )}

              {currentStep === 1 && (
                <Form
                  form={form}
                  name="verify-otp"
                  onFinish={async (values) => {
                    setIsLoading(true);
                    try {
                      const response = await fetch('/api/auth/otp/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          mobileNumber: form.getFieldValue('mobileNumber'),
                          otp: values.otp,
                        }),
                      });

                      const data = await response.json();
                      
                      if (response.ok) {
                        message.success('OTP verified successfully!');
                        setCurrentStep(2);
                      } else {
                        message.error(data.message || 'OTP verification failed');
                      }
                    } catch (error) {
                      console.error('OTP verification error:', error);
                      message.error('OTP verification failed. Please try again.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  layout="vertical"
                  size="large"
                >
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                    <Title level={3}>OTP Verification</Title>
                    <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
                      We've sent a 6-digit OTP to {form.getFieldValue('mobileNumber')}
                    </Text>
                    <Text code style={{ fontSize: '14px', padding: '8px 16px', background: '#f0f0f0' }}>
                      Check console for OTP (Development Mode)
                    </Text>
                  </div>

                  <Form.Item
                    name="otp"
                    label="Enter OTP"
                    rules={[
                      { required: true, message: 'Please enter the OTP' },
                      { pattern: /^[0-9]{6}$/, message: 'Please enter a valid 6-digit OTP' }
                    ]}
                  >
                    <Input
                      prefix={<SafetyOutlined />}
                      placeholder="Enter 6-digit OTP"
                      className="medical-input"
                      maxLength={6}
                      style={{ textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }}
                    />
                  </Form.Item>

                  <Form.Item>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="medical-button-primary"
                        block
                        size="large"
                      >
                        Verify OTP
                      </Button>
                      <Button
                        type="link"
                        onClick={() => setCurrentStep(0)}
                        style={{ width: '100%' }}
                      >
                        Change Mobile Number
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              )}

              {currentStep === 2 && (
                <div style={{ textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }} />
                  <Title level={3} style={{ color: '#52c41a' }}>
                    Registration Complete!
                  </Title>
                  <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
                    Welcome to NexaCare Medical System, {form.getFieldValue('fullName')}!
                  </Text>
                  <Text type="secondary" style={{ display: 'block' }}>
                    Redirecting to your dashboard...
                  </Text>
                  <div style={{ marginTop: '24px' }}>
                    <Button
                      type="primary"
                      onClick={() => setLocation('/login')}
                      className="medical-button-primary"
                      size="large"
                    >
                      Go to Login
                    </Button>
                  </div>
                </div>
              )}

              <Divider />

              <div style={{ textAlign: 'center' }}>
                <Text type="secondary">
                  Already have an account?{' '}
                <Link href="/login">
                    <Button type="link" style={{ padding: 0 }}>
                      Login here
                  </Button>
                </Link>
                </Text>
              </div>

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  By registering, you agree to our Terms of Service and Privacy Policy
                </Text>
              </div>
            </div>
        </Card>
        </Col>
      </Row>
    </div>
  );
}