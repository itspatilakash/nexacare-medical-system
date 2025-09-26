import React from 'react';
import { ConfigProvider } from 'antd';
import type { ThemeConfig } from 'antd';

// Medical theme configuration for NexaCare
export const medicalTheme: ThemeConfig = {
  token: {
    // Primary colors - Medical blue
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    
    // Medical-specific colors
    colorPrimaryBg: '#e6f7ff',
    colorSuccessBg: '#f6ffed',
    colorWarningBg: '#fffbe6',
    colorErrorBg: '#fff2f0',
    
    // Typography
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    
    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    
    // Spacing
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // Shadows
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 1px 4px rgba(0, 0, 0, 0.1)',
    
    // Medical form styling
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
  },
  components: {
    // Button customization
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      fontWeight: 500,
    },
    
    // Input customization
    Input: {
      borderRadius: 6,
      controlHeight: 40,
    },
    
    // Card customization
    Card: {
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    
    // Form customization
    Form: {
      labelFontSize: 14,
      labelColor: '#262626',
      itemMarginBottom: 24,
    },
    
    // Table customization
    Table: {
      headerBg: '#fafafa',
      headerColor: '#262626',
      rowHoverBg: '#f5f5f5',
    },
    
    // Layout customization
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#fafafa',
      bodyBg: '#ffffff',
    },
    
    // Menu customization
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e6f7ff',
      itemSelectedColor: '#1890ff',
      itemHoverBg: '#f5f5f5',
    },
    
    // Modal customization
    Modal: {
      borderRadius: 8,
      headerBg: '#ffffff',
    },
    
    // Notification customization
    Notification: {
      borderRadius: 6,
    },
    
    // Message customization
    Message: {
      borderRadius: 6,
    },
  },
};

// Export the theme provider component
export const MedicalThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider theme={medicalTheme}>
      {children}
    </ConfigProvider>
  );
};
