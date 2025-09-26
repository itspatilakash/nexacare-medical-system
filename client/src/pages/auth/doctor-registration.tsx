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
  MedicineBoxOutlined,
  GraduationCapOutlined
} from '@ant-design/icons';
import { apiRequest } from "../../lib/queryClient";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function DoctorRegistration() {
  const { message } = App.useApp();
  const [, setLocation] = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const registrationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/auth/register/doctor', {
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
        role: 'doctor'
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
          <MedicineBoxOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          <Title level={2} style={{ margin: '0 0 8px 0', color: '#1890ff' }}>
            Doctor Registration
          </Title>
          <Text type="secondary">
            Join our medical team and provide healthcare services
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
                label="First Name"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select your date of birth' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="Select date of birth"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="specialization"
            label="Medical Specialization"
            rules={[{ required: true, message: 'Please select specialization' }]}
          >
            <Select placeholder="Select your medical specialization">
              <Option value="cardiology">Cardiology</Option>
              <Option value="neurology">Neurology</Option>
              <Option value="orthopedics">Orthopedics</Option>
              <Option value="pediatrics">Pediatrics</Option>
              <Option value="dermatology">Dermatology</Option>
              <Option value="psychiatry">Psychiatry</Option>
              <Option value="general">General Medicine</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="licenseNumber"
            label="Medical License Number"
            rules={[{ required: true, message: 'Please enter your license number' }]}
          >
            <Input placeholder="Enter medical license number" />
          </Form.Item>

          <Form.Item
            name="experience"
            label="Years of Experience"
            rules={[{ required: true, message: 'Please enter years of experience' }]}
          >
            <Input type="number" placeholder="Enter years of experience" />
          </Form.Item>

          <Form.Item
            name="qualification"
            label="Medical Qualification"
            rules={[{ required: true, message: 'Please enter your qualification' }]}
          >
            <Input placeholder="e.g., MBBS, MD, etc." />
          </Form.Item>

          <Form.Item
            name="hospital"
            label="Associated Hospital"
            rules={[{ required: true, message: 'Please enter hospital name' }]}
          >
            <Input placeholder="Enter hospital name" />
          </Form.Item>

          <Form.Item
            name="consultationFee"
            label="Consultation Fee"
            rules={[{ required: true, message: 'Please enter consultation fee' }]}
          >
            <Input type="number" placeholder="Enter consultation fee" />
          </Form.Item>

          <Form.Item
            name="bio"
            label="Professional Bio"
          >
            <TextArea 
                rows={3}
              placeholder="Brief description of your professional background"
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
                icon={<GraduationCapOutlined />}
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