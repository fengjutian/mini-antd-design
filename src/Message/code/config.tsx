import { Button, configureToast, toast } from 'mini-antd-design';
import React from 'react';

export default () => {
  const handleConfig = () => {
    configureToast({
      top: 50,
      duration: 2,
      maxCount: 3,
    });
    toast.success('配置已更新');
  };

  return (
    <>
      <Button title="全局配置" onClick={handleConfig} />
    </>
  );
};
