import { Button, toast } from 'mini-antd-design';
import React from 'react';

export default () => {
  return (
    <>
      <Button title="成功提示" onClick={() => toast.success('操作成功')} />
      <Button title="错误提示" onClick={() => toast.error('操作失败')} />
      <Button title="信息提示" onClick={() => toast.info('这是一条信息')} />
      <Button title="警告提示" onClick={() => toast.warning('警告信息')} />
      <Button title="加载提示" onClick={() => toast.loading('加载中...')} />
    </>
  );
};
