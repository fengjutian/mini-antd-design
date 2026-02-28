import React from 'react';

// 定义消息类型
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';

// 定义消息选项接口
export interface ToastOptions {
  /** 唯一 key，用于更新同一条消息 */
  key?: string | number;
  /** 持续时间（秒），0 不自动关闭 */
  duration?: number;
  /** 自定义图标/样式（谨慎开放，建议只在少数场景使用） */
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
  onClick?: () => void;
}

// 定义消息 API 接口
export interface ToastAPI {
  success(content: React.ReactNode, options?: ToastOptions): Thenable;
  error(content: React.ReactNode, options?: ToastOptions): Thenable;
  info(content: React.ReactNode, options?: ToastOptions): Thenable;
  warning(content: React.ReactNode, options?: ToastOptions): Thenable;
  loading(content: React.ReactNode, options?: ToastOptions): Thenable;

  open(
    type: ToastType,
    content: React.ReactNode,
    options?: ToastOptions,
  ): Thenable;

  /** 销毁全部或按 key 销毁 */
  destroy(key?: string | number): void;
}

// 定义全局配置接口
export interface ToastGlobalConfig {
  top?: number;
  duration?: number;
  maxCount?: number;
  getContainer?: () => HTMLElement;
}

// 定义 Thenable 类型
export interface Thenable {
  then: (onFulfilled?: () => void) => Thenable;
}

// 全局消息实例引用
let messageImpl: ToastAPI | null = null;

// 全局配置
let globalConfig: ToastGlobalConfig = {
  top: 8,
  duration: 3,
  maxCount: 5,
  getContainer: () => document.body,
};

// 设置消息实现
export function setToastImpl(impl: ToastAPI) {
  messageImpl = impl;
}

// 获取消息实现
export function getToastImpl(): ToastAPI | null {
  return messageImpl;
}

// 配置全局 Toast 选项
export function configureToast(config: ToastGlobalConfig): void {
  globalConfig = { ...globalConfig, ...config };
}

// 获取全局配置
export function getGlobalConfig(): ToastGlobalConfig {
  return globalConfig;
}
