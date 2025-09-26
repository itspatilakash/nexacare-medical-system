import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Space, 
  Typography, 
  Row, 
  Col,
  App,
  Divider,
  Checkbox
} from 'antd';
import { 
  UserOutlined, 
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  BankOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { apiRequest } from "../../lib/queryClient";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function HospitalRegistration() {
  const { message } = App.useApp();
  const [, setLocation] = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const registrationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/auth/register/hospital', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      message.success('Registration successful! Please check your phone for OTP verification.');
      setLocation('/auth/otp-verification');
    },
    onError: (error: any) => {
      message.error(error.message || 'Registration failed. Please try again.');
    },
  });

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await registrationMutation.mutateAsync({
        ...values,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        role: 'hospital'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%', 
          maxWidth: '600px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <BankOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2} style={{ margin: '0 0 8px 0', color: '#1890ff' }}>
            Hospital Registration
          </Title>
          <Text type="secondary">
            Register your hospital to provide comprehensive healthcare services
          </Text>
          </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="Admin First Name"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Admin Last Name"
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' }
            ]}
          >
                <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter 10-digit phone number" 
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
                <Input
              prefix={<MailOutlined />}
              placeholder="Enter email address" 
            />
          </Form.Item>

          <Form.Item
            name="hospitalName"
            label="Hospital Name"
            rules={[{ required: true, message: 'Please enter hospital name' }]}
          >
            <Input placeholder="Enter hospital name" />
          </Form.Item>

          <Form.Item
            name="hospitalType"
            label="Hospital Type"
            rules={[{ required: true, message: 'Please select hospital type' }]}
          >
            <Select placeholder="Select hospital type">
              <Option value="general">General Hospital</Option>
              <Option value="specialty">Specialty Hospital</Option>
              <Option value="clinic">Clinic</Option>
              <Option value="medical_center">Medical Center</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="Hospital Address"
            rules={[{ required: true, message: 'Please enter hospital address' }]}
          >
            <TextArea 
                rows={3}
              placeholder="Enter complete hospital address"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter city' }]}
              >
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please enter state' }]}
              >
                <Input placeholder="Enter state" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="pincode"
            label="PIN Code"
            rules={[
              { required: true, message: 'Please enter PIN code' },
              { pattern: /^[0-9]{6}$/, message: 'Please enter a valid 6-digit PIN code' }
            ]}
          >
            <Input placeholder="Enter 6-digit PIN code" />
          </Form.Item>

          <Form.Item
            name="licenseNumber"
            label="Hospital License Number"
            rules={[{ required: true, message: 'Please enter license number' }]}
          >
            <Input placeholder="Enter hospital license number" />
          </Form.Item>

          <Form.Item
            name="beds"
            label="Number of Beds"
            rules={[{ required: true, message: 'Please enter number of beds' }]}
          >
            <Input type="number" placeholder="Enter number of beds" />
          </Form.Item>

          <Form.Item
            name="specialties"
            label="Medical Specialties"
          >
            <Select 
              mode="multiple"
              placeholder="Select medical specialties offered"
            >
              <Option value="cardiology">Cardiology</Option>
              <Option value="neurology">Neurology</Option>
              <Option value="orthopedics">Orthopedics</Option>
              <Option value="pediatrics">Pediatrics</Option>
              <Option value="dermatology">Dermatology</Option>
              <Option value="psychiatry">Psychiatry</Option>
              <Option value="emergency">Emergency Medicine</Option>
              <Option value="surgery">Surgery</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Hospital Description"
          >
            <TextArea 
              rows={3}
              placeholder="Brief description of your hospital services"
            />
          </Form.Item>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[{ required: true, message: 'Please accept the terms and conditions' }]}
          >
            <Checkbox>
              I agree to the terms and conditions and privacy policy
            </Checkbox>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Button 
                icon={<ArrowLeftOutlined />}
                onClick={() => setLocation('/auth/register')}
              >
                Back
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<BankOutlined />}
                style={{ minWidth: '120px' }}
              >
                Register
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary">
            Already have an account?{' '}
            <Button type="link" onClick={() => setLocation('/auth/login')}>
              Sign In
            </Button>
          </Text>
        </div>
      </Card>
    </div>
  );
}