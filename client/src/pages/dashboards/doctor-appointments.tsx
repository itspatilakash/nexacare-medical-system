import { useState, useEffect } from "react";
import { 
  Layout, 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Table, 
  Tag, 
  Space, 
  Typography,
  Avatar,
  Menu,
  Dropdown,
  Badge,
  Progress,
  Timeline,
  List,
  Input,
  Select,
  Modal,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  CalendarOutlined, 
  MedicineBoxOutlined, 
  FileTextOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  BankOutlined,
  UserAddOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined,
  PhoneOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import { useAuth } from '../../hooks/use-auth';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function DoctorAppointments() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  // Mock data for demo purposes
  useEffect(() => {
    const mockAppointments = [
      {
        id: 1,
        patientName: "Jane Doe",
        patientAge: 28,
        patientGender: "Female",
        appointmentDate: "2024-09-26T10:00:00Z",
        appointmentTime: "10:00 AM",
        timeSlot: "10:00-10:30",
        reason: "Regular checkup",
        status: "confirmed",
        type: "online",
        priority: "normal",
        symptoms: "None",
        notes: "First appointment",
        medicalHistory: "No significant medical history",
        allergies: "None known",
        createdAt: "2024-09-25T08:00:00Z"
      },
      {
        id: 2,
        patientName: "John Smith",
        patientAge: 45,
        patientGender: "Male",
        appointmentDate: "2024-09-26T11:00:00Z",
        appointmentTime: "11:00 AM",
        timeSlot: "11:00-11:30",
        reason: "Chest pain consultation",
        status: "pending",
        type: "online",
        priority: "high",
        symptoms: "Chest pain, shortness of breath",
        notes: "Urgent consultation needed",
        medicalHistory: "Hypertension, diabetes",
        allergies: "Penicillin",
        createdAt: "2024-09-25T09:00:00Z"
      },
      {
        id: 3,
        patientName: "Sarah Wilson",
        patientAge: 32,
        patientGender: "Female",
        appointmentDate: "2024-09-25T14:00:00Z",
        appointmentTime: "2:00 PM",
        timeSlot: "14:00-14:30",
        reason: "Follow-up consultation",
        status: "completed",
        type: "online",
        priority: "normal",
        symptoms: "Headache",
        notes: "Follow-up from previous visit",
        medicalHistory: "Migraine history",
        allergies: "None known",
        createdAt: "2024-09-24T10:00:00Z",
        completedAt: "2024-09-25T14:30:00Z"
      },
      {
        id: 4,
        patientName: "Mike Johnson",
        patientAge: 55,
        patientGender: "Male",
        appointmentDate: "2024-09-24T09:00:00Z",
        appointmentTime: "9:00 AM",
        timeSlot: "09:00-09:30",
        reason: "Blood pressure check",
        status: "completed",
        type: "online",
        priority: "normal",
        symptoms: "High blood pressure",
        notes: "Routine checkup",
        medicalHistory: "Hypertension, heart disease",
        allergies: "None known",
        createdAt: "2024-09-23T08:00:00Z",
        completedAt: "2024-09-24T09:30:00Z"
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);

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
      type: 'divider',
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
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
    },
    {
      key: 'patients',
      icon: <TeamOutlined />,
      label: 'Patients',
    },
    {
      key: 'prescriptions',
      icon: <FileTextOutlined />,
      label: 'Prescriptions',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'cancelled':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getStatusTag = (status: string) => {
    const colorMap = {
      confirmed: 'success',
      pending: 'warning',
      completed: 'processing',
      cancelled: 'error'
    };
    
    return (
      <Tag color={colorMap[status as keyof typeof colorMap] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Tag>
    );
  };

  const getPriorityTag = (priority: string) => {
    const colorMap = {
      high: 'red',
      normal: 'green',
      low: 'default'
    };
    
    return (
      <Tag color={colorMap[priority as keyof typeof colorMap] || 'default'}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
      </Tag>
    );
  };

  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleConfirmAppointment = (appointmentId: number) => {
    setAppointments((prev: any[]) => 
      prev.map((apt: any) => 
        apt.id === appointmentId 
          ? { ...apt, status: 'confirmed', confirmedAt: new Date().toISOString() }
          : apt
      )
    );
  };

  const handleCompleteAppointment = (appointmentId: number) => {
    setAppointments((prev: any[]) => 
      prev.map((apt: any) => 
        apt.id === appointmentId 
          ? { ...apt, status: 'completed', completedAt: new Date().toISOString() }
          : apt
      )
    );
  };

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
          defaultSelectedKeys={['appointments']}
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
            <Title level={2} style={{ margin: '0 0 16px 0', color: '#1890ff' }}>
              <CalendarOutlined style={{ marginRight: '8px' }} />
              My Appointments
            </Title>
            <Text type="secondary">Manage your patient appointments</Text>
          </div>

          {/* Filters and Search */}
          <Card style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={12} md={16}>
                <Search
                  placeholder="Search patients or appointments..."
                  allowClear
                  style={{ width: '100%' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Space wrap>
                  <Button 
                    type={filter === 'all' ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setFilter('all')}
                  >
                    All
                  </Button>
                  <Button 
                    type={filter === 'pending' ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setFilter('pending')}
                  >
                    Pending
                  </Button>
                  <Button 
                    type={filter === 'confirmed' ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setFilter('confirmed')}
                  >
                    Confirmed
                  </Button>
                  <Button 
                    type={filter === 'completed' ? 'primary' : 'default'}
                    size="small"
                    onClick={() => setFilter('completed')}
                  >
                    Completed
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Appointments List */}
          {loading ? (
            <div>
              {[1, 2, 3].map((i) => (
                <Card key={i} loading style={{ marginBottom: '16px' }}>
                  <Card.Meta
                    avatar={<Avatar />}
                    title="Loading..."
                    description="Loading appointment details..."
                  />
                </Card>
              ))}
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div>
              {filteredAppointments.map((appointment: any) => (
                <Card 
                  key={appointment.id} 
                  style={{ marginBottom: '16px' }}
                  hoverable
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flex: 1 }}>
                      <Avatar 
                        size={48} 
                        style={{ backgroundColor: '#52c41a', color: '#fff' }}
                      >
                        {appointment.patientName?.charAt(0) || "P"}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Title level={4} style={{ margin: 0 }}>
                            {appointment.patientName}
                          </Title>
                          {getStatusIcon(appointment.status)}
                          {getPriorityTag(appointment.priority)}
                        </div>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
                          {appointment.patientAge} years old • {appointment.patientGender}
                        </Text>
                        <Text style={{ display: 'block', marginBottom: '8px' }}>
                          {appointment.reason}
                        </Text>
                        <Space size="large">
                          <Space>
                            <CalendarOutlined />
                            <Text type="secondary">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </Text>
                          </Space>
                          <Space>
                            <ClockCircleOutlined />
                            <Text type="secondary">
                              {appointment.appointmentTime}
                            </Text>
                          </Space>
                          <Space>
                            <VideoCameraOutlined />
                            <Text type="secondary">
                              {appointment.type}
                            </Text>
                          </Space>
                        </Space>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      {getStatusTag(appointment.status)}
                      <Space>
                        {appointment.status === 'pending' && (
                          <Button 
                            type="primary"
                            size="small"
                            onClick={() => handleConfirmAppointment(appointment.id)}
                          >
                            Confirm
                          </Button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <>
                            <Button 
                              size="small" 
                              icon={<PhoneOutlined />}
                            >
                              Start Call
                            </Button>
                            <Button 
                              type="primary"
                              size="small"
                              onClick={() => handleCompleteAppointment(appointment.id)}
                            >
                              Complete
                            </Button>
                          </>
                        )}
                        <Button size="small">
                          View Details
                        </Button>
                      </Space>
                    </div>
                  </div>
                  
                  {appointment.symptoms && (
                    <div style={{ 
                      marginTop: '16px', 
                      padding: '12px', 
                      background: '#fffbe6', 
                      borderRadius: '6px',
                      border: '1px solid #ffe58f'
                    }}>
                      <Text strong>Symptoms: </Text>
                      <Text>{appointment.symptoms}</Text>
                    </div>
                  )}
                  
                  {appointment.medicalHistory && (
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '12px', 
                      background: '#e6f7ff', 
                      borderRadius: '6px',
                      border: '1px solid #91d5ff'
                    }}>
                      <Text strong>Medical History: </Text>
                      <Text>{appointment.medicalHistory}</Text>
                    </div>
                  )}
                  
                  {appointment.allergies && (
                    <div style={{ 
                      marginTop: '8px', 
                      padding: '12px', 
                      background: '#fff2f0', 
                      borderRadius: '6px',
                      border: '1px solid #ffccc7'
                    }}>
                      <Text strong>Allergies: </Text>
                      <Text>{appointment.allergies}</Text>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <CalendarOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Title level={3} style={{ color: '#8c8c8c', marginBottom: '8px' }}>
                  No appointments found
                </Title>
                <Text type="secondary">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'You don\'t have any appointments scheduled'
                  }
                </Text>
              </div>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}
