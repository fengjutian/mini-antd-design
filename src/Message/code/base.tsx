import { Button, toast } from 'mini-antd-design';
import React from 'react';

export default () => {
  const onSuccess = () => {
    console.log('111', toast);
    return toast.success('操作成功');
  };
  const onError = () => toast.error('操作失败');
  const onInfo = () => toast.info('这是一条信息');
  const onWarning = () => toast.warning('警告信息');
  const onLoading = () => toast.loading('加载中...');

  return (
    <>
      <Button title="成功提示" onClick={onSuccess} />
      <Button title="错误提示" onClick={onError} />
      <Button title="信息提示" onClick={onInfo} />
      <Button title="警告提示" onClick={onWarning} />
      <Button title="加载提示" onClick={onLoading} />
    </>
  );
};
