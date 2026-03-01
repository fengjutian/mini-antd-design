import React from 'react';
import { setToastImpl } from './toast-impl';

export function useToastBridge() {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const antd = (window as any).antd;
        if (antd?.App) {
          const App = antd.App;
          if (typeof App.useApp === 'function') {
            const app = App.useApp(); // eslint-disable-line react-hooks/rules-of-hooks
            if (app?.message) {
              setToastImpl(app.message);
            }
          }
        }
      } catch (error) {
        console.warn('Ant Design is not available, ToastBridge will not work');
      }
    }
  }, []);
}

export function ToastBridge() {
  useToastBridge();
  return null;
}
