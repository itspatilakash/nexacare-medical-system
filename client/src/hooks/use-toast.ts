import { App } from 'antd';

// Simple wrapper around Ant Design's message system using App component
export const useToast = () => {
  const { message } = App.useApp();
  
  return {
    toast: (props: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
      if (props.variant === 'destructive') {
        message.error(props.title || props.description || 'An error occurred');
      } else {
        message.success(props.title || props.description || 'Success');
      }
    },
    dismiss: () => {
      // Ant Design messages auto-dismiss, so this is a no-op
    }
  };
};

// For backward compatibility, we'll create a toast function that uses the App context
// This should be used within components that have access to App.useApp()
export const createToast = (message: any) => (props: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => {
  if (props.variant === 'destructive') {
    message.error(props.title || props.description || 'An error occurred');
  } else {
    message.success(props.title || props.description || 'Success');
  }
};