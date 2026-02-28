import { Button, toast } from 'mini-antd-design';
import React from 'react';

export default () => {
  const handleClick = () => {
    toast.success('保存成功', { duration: 2 }).then(() => {
      console.log('提示结束后执行');
    });
  };

  return (
    <>
      <Button title="Promise 示例" onClick={handleClick} />
    </>
  );
};
