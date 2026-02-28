import React from 'react';
import { setToastImpl } from './toast-impl';

export function ToastBridge() {
  // 导入 antd 的 App 组件
  const App = require('antd').App;

  // 在组件顶层调用 Hook
  const app = App?.useApp();
  const message = app?.message;

  // 将 message 实例写入到模块级变量
  React.useEffect(() => {
    if (message) {
      setToastImpl(message);
    }
  }, [message]);

  return null;
}
