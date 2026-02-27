# 欢迎页面

## Button 组件自定义

### 属性说明

- `title`: 按钮文字
- `type`: 按钮类型，可选值：`primary`、`default`、`danger`
- `size`: 按钮大小，可选值：`small`、`medium`、`large`
- `onClick`: 点击事件回调

### 使用示例

```jsx
import Button from 'mini-antd-design';

export default () => (
  <Button
    title="自定义按钮"
    type="primary"
    size="large"
    onClick={() => console.log('按钮被点击')}
  />
);
```
