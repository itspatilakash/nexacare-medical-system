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
                <div style={{ textAlign: 'center' }}>
                  <SafetyOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                  <Title level={3}>OTP Verification</Title>
                  <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
                    We've sent a 6-digit OTP to your mobile number
                  </Text>
                  <Text code style={{ fontSize: '16px', padding: '8px 16px' }}>
                    Check console for OTP (Development Mode)
                  </Text>
                  <div style={{ marginTop: '24px' }}>
              <Button
                      type="primary"
                      onClick={() => setLocation('/otp-verification')}
                      className="medical-button-primary"
                      size="large"
                    >
                      Verify OTP
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