import { ReactNode } from 'react';
import {
  configureToast,
  getGlobalConfig,
  getToastImpl,
  ToastAPI,
  ToastOptions,
  ToastType,
} from './toast-impl';
import { ToastBridge } from './ToastBridge';

// 消息项接口
interface MessageItem {
  key: string | number;
  type: ToastType;
  content: ReactNode;
  options: ToastOptions;
  promise: {
    resolve: () => void;
    reject: (error: any) => void;
  };
}

// 生成唯一 key
const generateKey = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// 检查是否在浏览器环境中
const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

// 全局消息实例
let globalInstance: any = null;
let globalContainer: HTMLElement | null = null;

// 渲染全局消息
const renderGlobalMessages = () => {
  if (!isBrowser || !globalInstance || !globalContainer) return;

  const { messages } = globalInstance;

  // 清空容器
  globalContainer.innerHTML = '';

  // 渲染消息
  messages.forEach((item: MessageItem) => {
    const { key, type, content, options } = item;
    const { icon, style, className, onClick } = options;

    // 创建消息元素
    const messageElement = document.createElement('div');
    messageElement.dataset.key = key.toString();
    messageElement.className = `ant-message-notice ${className || ''}`;

    // 设置样式
    Object.assign(messageElement.style, {
      marginBottom: '8px',
      padding: '8px 16px',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'auto',
      ...style,
    });

    // 创建内容元素
    const contentElement = document.createElement('div');
    contentElement.className = 'ant-message-notice-content';

    // 创建图标元素
    if (icon) {
      // 这里简化处理，实际项目中可能需要更复杂的 React 元素渲染
      const iconElement = document.createElement('span');
      iconElement.className = `ant-message-icon`;
      contentElement.appendChild(iconElement);
    } else {
      const iconElement = document.createElement('span');
      iconElement.className = `ant-message-${type}-icon`;
      contentElement.appendChild(iconElement);
    }

    // 创建文本元素
    const textElement = document.createElement('span');
    textElement.className = 'ant-message-notice-content-text';
    textElement.textContent =
      typeof content === 'string' ? content : String(content);
    contentElement.appendChild(textElement);

    // 添加内容到消息元素
    messageElement.appendChild(contentElement);

    // 添加点击事件
    if (onClick) {
      messageElement.addEventListener('click', onClick);
    }

    // 添加到容器
    if (globalContainer) {
      globalContainer.appendChild(messageElement);
    }
  });
};

// 创建全局消息实例
const createGlobalInstance = () => {
  if (!globalInstance) {
    let messages: MessageItem[] = [];
    const config = getGlobalConfig();
    const timers = new Map<string | number, NodeJS.Timeout>();

    // 创建全局容器
    if (isBrowser && !globalContainer) {
      globalContainer = document.createElement('div');
      globalContainer.className = 'ant-message';
      Object.assign(globalContainer.style, {
        top: `${config.top}px`,
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '1010',
        width: '100%',
        maxWidth: '400px',
        pointerEvents: 'none',
      });
      const container = config.getContainer
        ? config.getContainer()
        : document.body;
      container.appendChild(globalContainer);
    }

    const removeMessage = (key: string | number) => {
      messages = messages.filter((item) => item.key !== key);
      if (timers.has(key)) {
        clearTimeout(timers.get(key)!);
        timers.delete(key);
      }
      // 重新渲染
      renderGlobalMessages();
    };

    const addMessage = (
      type: ToastType,
      content: ReactNode,
      options: ToastOptions = {},
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        const key = options.key || generateKey();
        const newMessage: MessageItem = {
          key,
          type,
          content,
          options: {
            duration: config.duration,
            ...options,
          },
          promise: { resolve, reject },
        };

        // 检查是否已存在相同 key 的消息
        const existingIndex = messages.findIndex((item) => item.key === key);
        if (existingIndex !== -1) {
          // 更新现有消息
          messages[existingIndex] = newMessage;
        } else {
          // 添加新消息
          messages = [...messages, newMessage];
          // 限制最大消息数
          if (messages.length > config.maxCount!) {
            messages = messages.slice(messages.length - config.maxCount!);
          }
        }

        // 渲染消息
        renderGlobalMessages();

        // 设置自动消失定时器
        if (options.duration !== 0) {
          const duration = options.duration || config.duration!;
          const timer = setTimeout(() => {
            removeMessage(key);
            resolve();
            // 调用 onClose 回调
            if (options.onClose) {
              options.onClose();
            }
          }, duration * 1000);
          timers.set(key, timer);
        }
      });
    };

    const destroy = (key?: string | number) => {
      if (key) {
        removeMessage(key);
      } else {
        timers.forEach((timer) => clearTimeout(timer));
        timers.clear();
        messages = [];
        // 清空容器
        if (globalContainer) {
          globalContainer.innerHTML = '';
        }
      }
    };

    globalInstance = {
      messages,
      addMessage,
      removeMessage,
      destroy,
      config,
    };
  }
  return globalInstance;
};

// 静态方法 API
const toast: ToastAPI = {
  success: (content: ReactNode, options?: ToastOptions) => {
    const toastImpl = getToastImpl();
    if (toastImpl) {
      return toastImpl.success(content, options);
    }
    // 在非浏览器环境中，返回一个 resolved 的 Promise
    if (!isBrowser) {
      return {
        then: (onFulfilled?: () => void) => {
          if (onFulfilled) onFulfilled();
          return toast.success(content, options);
        },
      };
    }
    const instance = createGlobalInstance();
    return instance.addMessage('success', content, options);
  },
  error: (content: ReactNode, options?: ToastOptions) => {
    const toastImpl = getToastImpl();
    if (toastImpl) {
      return toastImpl.error(content, options);
    }
    // 在非浏览器环境中，返回一个 resolved 的 Promise
    if (!isBrowser) {
      return {
        then: (onFulfilled?: () => void) => {
          if (onFulfilled) onFulfilled();
          return toast.error(content, options);
        },
      };
    }
    const instance = createGlobalInstance();
    return instance.addMessage('error', content, options);
  },
  info: (content: ReactNode, options?: ToastOptions) => {
    const toastImpl = getToastImpl();
    if (toastImpl) {
      return toastImpl.info(content, options);
    }
    // 在非浏览器环境中，返回一个 resolved 的 Promise
    if (!isBrowser) {
      return {
        then: (onFulfilled?: () => void) => {
          if (onFulfilled) onFulfilled();
          return toast.info(content, options);
        },
      };
    }
    const instance = createGlobalInstance();
    return instance.addMessage('info', content, options);
  },
  warning: (content: ReactNode, options?: ToastOptions) => {
    const toastImpl = getToastImpl();
    if (toastImpl) {
      return toastImpl.warning(content, options);
    }
    // 在非浏览器环境中，返回一个 resolved 的 Promise
    if (!isBrowser) {
      return {
        then: (onFulfilled?: () => void) => {
          if (onFulfilled) onFulfilled();
          return toast.warning(content, options);
        },
      };
    }
    const instance = createGlobalInstance();
    return instance.addMessage('warning', content, options);
  },
  loading: (content: ReactNode, options?: ToastOptions) => {
    const toastImpl = getToastImpl();
    if (toastImpl) {
      return toastImpl.loading(content, options);
    }
    // 在非浏览器环境中，返回一个 resolved 的 Promise
    if (!isBrowser) {
      return {
        then: (onFulfilled?: () => void) => {
          if (onFulfilled) onFulfilled();
          return toast.loading(content, options);
        },
      };
    }
    const instance = createGlobalInstance();
    return instance.addMessage('loading', content, options);
  },
  open: (type: ToastType, content: ReactNode, options?: ToastOptions) => {
    const toastImpl = getToastImpl();
    if (toastImpl) {
      return toastImpl.open(type, content, options);
    }
    // 在非浏览器环境中，返回一个 resolved 的 Promise
    if (!isBrowser) {
      return {
        then: (onFulfilled?: () => void) => {
          if (onFulfilled) onFulfilled();
          return toast.open(type, content, options);
        },
      };
    }
    const instance = createGlobalInstance();
    return instance.addMessage(type, content, options);
  },
  destroy: (key?: string | number) => {
    const toastImpl = getToastImpl();
    if (toastImpl) {
      toastImpl.destroy(key);
      return;
    }
    // 在非浏览器环境中，不做任何操作
    if (!isBrowser) {
      return;
    }
    const instance = createGlobalInstance();
    instance.destroy(key);
  },
};

// 导出
export { configureToast, toast, ToastBridge };

export default toast;
