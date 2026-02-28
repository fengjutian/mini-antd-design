import { Button, toast } from 'mini-antd-design';
import React from 'react';

export default () => {
  const handleCustom = () => {
    toast.open('info', '自定义消息', {
      duration: 5,
      onClick: () => console.log('消息被点击'),
      style: { background: '#f0f0f0', padding: '16px' },
    });
  };

  return (
    <>
      <Button title="自定义消息" onClick={handleCustom} />
    </>
  );
};
