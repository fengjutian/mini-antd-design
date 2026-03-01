import React, {
  forwardRef,
  type CSSProperties,
  type ComponentType,
} from 'react';

export interface IconProps {
  className?: string;
  rotate?: number;
  spin?: boolean;
  style?: CSSProperties;
  twoToneColor?: string | string[];
  component?: ComponentType<CustomIconComponentProps>;
}

export interface CustomIconComponentProps {
  className?: string;
  style?: CSSProperties;
  rotate?: number;
  spin?: boolean;
  viewBox?: string;
  children?: React.ReactNode;
}

export interface CustomIconProps extends Omit<IconProps, 'twoToneColor'> {
  component: ComponentType<CustomIconComponentProps>;
}

export interface IconfontCNOptions {
  extraCommonProps?: Record<string, unknown>;
  scriptUrl: string | string[];
}

export interface IconfontIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  type: string;
}

export interface IconGlobalConfig {
  defaultTwoToneColor?: string;
  iconfontScriptUrlWhitelist?: string[];
}

const getSpinClassName = (spin: boolean): string => {
  return spin ? 'anticon-spin' : '';
};

const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  const { className, rotate, spin, style, component, ...restProps } = props;

  const innerStyle: CSSProperties = {
    ...style,
  };

  if (rotate) {
    innerStyle.transform = `rotate(${rotate}deg)`;
  }

  const classNames = ['anticon', className, getSpinClassName(spin || false)]
    .filter(Boolean)
    .join(' ');

  const iconProps: CustomIconComponentProps = {
    className: 'anticon',
    style: innerStyle,
    rotate,
    spin,
  };

  if (component) {
    const Component = component;
    return (
      <span ref={ref} className={classNames} {...restProps}>
        <Component {...iconProps} />
      </span>
    );
  }

  return (
    <span ref={ref} className={classNames} style={innerStyle} {...restProps}>
      <svg
        viewBox="0 0 1024 1024"
        fill="currentColor"
        width="1em"
        height="1em"
        style={{ display: 'block' }}
      >
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
      </svg>
    </span>
  );
});

Icon.displayName = 'Icon';

export const setTwoToneColor = (_color: string | string[]): void => {
  // eslint-disable-line @typescript-eslint/no-unused-vars
};

export const getTwoToneColor = (): string => {
  return '#1890ff';
};

export const createFromIconfontCN = (
  _options: IconfontCNOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
): ComponentType<IconfontIconProps> => {
  const IconfontIcon = forwardRef<HTMLSpanElement, IconfontIconProps>(
    (props, ref) => {
      const { type, ...restProps } = props;
      return <Icon ref={ref} {...restProps} className={`iconfont-${type}`} />;
    },
  );
  IconfontIcon.displayName = 'IconfontIcon';
  return IconfontIcon;
};

export const configureIcon = (_config: IconGlobalConfig): void => {
  // eslint-disable-line @typescript-eslint/no-unused-vars
};

export default Icon;
