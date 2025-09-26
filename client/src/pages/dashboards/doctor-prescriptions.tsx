import { useState } from "react";
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Tag, 
  Space, 
  Typography,
  Avatar,
  Menu,
  Dropdown,
  Badge,
  List,
  Modal,
  Form,
  Input,
  Select
} from 'antd';
import { 
  UserOutlined, 
  MedicineBoxOutlined, 
  FileTextOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/use-auth';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function DoctorPrescriptionsPage() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  const sidebarMenu = [
    {
      key: 'dashboard',
      icon: <UserOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'prescriptions',
      icon: <FileTextOutlined />,
      label: 'Prescriptions',
    },
  ];

  // Mock prescription data
  const prescriptions = [
    {
      id: 1,
      patientName: "Jane Doe",
      date: "2024-09-26",
      medications: [
        { name: "Paracetamol", dosage: "500mg", frequency: "3 times daily" },
        { name: "Amoxicillin", dosage: "250mg", frequency: "2 times daily" }
      ],
      status: "active"
    },
    {
      id: 2,
      patientName: "John Smith",
      date: "2024-09-25",
      medications: [
        { name: "Ibuprofen", dosage: "400mg", frequency: "2 times daily" }
      ],
      status: "completed"
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#fff',
          boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
        }}
      >
        <div style={{ 
          padding: '16px', 
          textAlign: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <MedicineBoxOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          {!collapsed && (
            <Title level={4} style={{ margin: '8px 0 0 0', color: '#1890ff' }}>
              NexaCare
            </Title>
          )}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['prescriptions']}
          style={{ borderRight: 0 }}
          items={sidebarMenu}
        />
      </Sider>
      
      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <PlusOutlined /> : <PlusOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <Space>
            <Badge count={5} size="small">
              <BellOutlined style={{ fontSize: '18px' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                <Text strong>{user?.fullName}</Text>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ margin: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 112px)' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <Title level={2} style={{ margin: '0 0 8px 0', color: '#1890ff' }}>
                  <FileTextOutlined style={{ marginRight: '8px' }} />
                  Prescriptions
                </Title>
                <Text type="secondary">Manage patient prescriptions</Text>
              </div>
              <Space>
                <Button icon={<DownloadOutlined />}>
                  Export
                </Button>
                <Button icon={<UploadOutlined />}>
                  Import
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setIsPrescriptionModalOpen(true)}
                >
                  New Prescription
                </Button>
              </Space>
            </div>
          </div>

          {/* Quick Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Total Prescriptions"
                  value={156}
                  prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="This Month"
                  value={42}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Pending"
                  value={8}
                  prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card>
                <Statistic
                  title="Today"
                  value={12}
                  prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
                />
              </Card>
            </Col>
          </Row>

          {/* Prescriptions List */}
          <Card title="Prescription Management">
            <div>
              {prescriptions.map((prescription) => (
                <Card 
                  key={prescription.id} 
                  style={{ marginBottom: '16px' }}
                  title={
                    <Space>
                      <FileTextOutlined />
                      Prescription #{prescription.id}
                    </Space>
                  }
                  extra={
                    <Space>
                      <Tag color={prescription.status === 'active' ? 'green' : 'blue'}>
                        {prescription.status}
                      </Tag>
                      <Button type="primary" icon={<DownloadOutlined />}>
                        Download
                      </Button>
                    </Space>
                  }
                >
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Text strong>Patient: </Text>
                      <Text>{prescription.patientName}</Text>
                    </Col>
                    <Col span={8}>
                      <Text strong>Date: </Text>
                      <Text>{prescription.date}</Text>
                    </Col>
                    <Col span={8}>
                      <Text strong>Medications: </Text>
                      <Text>{prescription.medications.length}</Text>
                    </Col>
                  </Row>
                  
                  <div style={{ marginTop: '16px' }}>
                    <Title level={5}>Medications:</Title>
                    <List
                      dataSource={prescription.medications}
                      renderItem={(medication) => (
                        <List.Item>
                          <List.Item.Meta
                            title={medication.name}
                            description={`${medication.dosage} - ${medication.frequency}`}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Prescription Modal */}
          <Modal
            title="Create New Prescription"
            open={isPrescriptionModalOpen}
            onCancel={() => setIsPrescriptionModalOpen(false)}
            footer={null}
            width={600}
          >
            <Form layout="vertical">
              <Form.Item label="Patient" required>
                <Select placeholder="Select patient">
                  <Option value="jane">Jane Doe</Option>
                  <Option value="john">John Smith</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Medications" required>
                <Input.TextArea placeholder="Enter medications and dosages" rows={4} />
              </Form.Item>
              <Form.Item label="Instructions">
                <Input.TextArea placeholder="Special instructions" rows={3} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary">Save Prescription</Button>
                  <Button onClick={() => setIsPrescriptionModalOpen(false)}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
}