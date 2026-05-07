import { App } from 'antd';
import type { NotificationArgsProps } from 'antd';

export function useNotification() {
  const { notification } = App.useApp();

  return {
    success: (message: string, description?: string) => {
      notification.success({ message, description, placement: 'topLeft' });
    },
    error: (message: string, description?: string) => {
      notification.error({ message, description, placement: 'topLeft' });
    },
    warning: (message: string, description?: string) => {
      notification.warning({ message, description, placement: 'topLeft' });
    },
    info: (message: string, description?: string) => {
      notification.info({ message, description, placement: 'topLeft' });
    },
    open: (config: NotificationArgsProps) => {
      notification.open(config);
    },
  };
}
