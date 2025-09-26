import { Card, Typography, Space } from 'antd';
import { ExclamationCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const { Title, Text } = Typography;

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#f5f5f5' 
    }}>
      <Card style={{ width: '100%', maxWidth: '400px', margin: '0 16px' }}>
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f', marginBottom: '16px' }} />
              <Title level={1} style={{ margin: '0 0 16px 0', color: '#262626' }}>
                404 Page Not Found
              </Title>
            </div>
            
            <Text type="secondary" style={{ fontSize: '16px' }}>
              The page you're looking for doesn't exist or has been moved.
            </Text>
            
            <Button 
              type="primary" 
              size="large" 
              icon={<HomeOutlined />}
              href="/"
              style={{ marginTop: '16px' }}
            >
              Go Home
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
}
