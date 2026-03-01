import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  type CSSProperties,
  type ComponentType,
  type ReactNode,
} from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  rotate?: number;
  spin?: boolean;
  style?: CSSProperties;
  twoToneColor?: TwoToneColor;
  component?: ComponentType<any>;
}

export type TwoToneColor = string | [string, string];

export interface CustomIconComponentProps {
  className?: string;
  style?: CSSProperties;
  rotate?: number;
  spin?: boolean;
  twoToneColor?: TwoToneColor;
  width?: string | number;
  height?: string | number;
  fill?: string;
  viewBox?: string;
  children?: React.ReactNode;
}

export interface CustomIconProps extends Omit<IconProps, 'twoToneColor'> {
  component: ComponentType<any>;
}

export interface IconfontCNOptions {
  extraCommonProps?: Record<string, unknown>;
  scriptUrl: string | string[];
}

export interface IconfontIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  type: string;
  spin?: boolean;
  rotate?: number;
}

export interface IconGlobalConfig {
  defaultTwoToneColor?: string;
  iconfontScriptUrlWhitelist?: string[];
}

interface IconConfigContextValue {
  defaultTwoToneColor: string;
  iconfontScriptUrlWhitelist: string[];
}

const defaultGlobalConfig: IconConfigContextValue = {
  defaultTwoToneColor: '#1890ff',
  iconfontScriptUrlWhitelist: ['//at.alicdn.com'],
};

let globalConfig: IconConfigContextValue = {
  ...defaultGlobalConfig,
};
let twoTonePrimaryColor = defaultGlobalConfig.defaultTwoToneColor;

const IconConfigContext = createContext<IconConfigContextValue | null>(null);

const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';
const injectedScriptUrls = new Set<string>();

const getGlobalConfig = (): IconConfigContextValue => {
  return globalConfig;
};

const useIconConfig = (): IconConfigContextValue => {
  return useContext(IconConfigContext) ?? getGlobalConfig();
};

const normalizeScriptUrls = (scriptUrl: string | string[]): string[] => {
  return (Array.isArray(scriptUrl) ? scriptUrl : [scriptUrl]).filter(Boolean);
};

const canLoadScript = (url: string, whitelist: string[]): boolean => {
  if (!whitelist.length) {
    return true;
  }
  return whitelist.some((prefix) => url.startsWith(prefix));
};

const ensureIconfontScript = (url: string, whitelist: string[]): void => {
  if (!isBrowser || injectedScriptUrls.has(url)) {
    return;
  }

  if (!canLoadScript(url, whitelist)) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `[Icon] Blocked iconfont scriptUrl "${url}". Add an allowed prefix to iconfontScriptUrlWhitelist.`,
      );
    }
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('data-iconfont', url);
  script.src = url;
  script.async = true;
  document.body.appendChild(script);
  injectedScriptUrls.add(url);
};

const getSpinClassName = (spin: boolean): string => {
  return spin ? 'anticon-spin' : '';
};

const mergeRotateStyle = (
  style: CSSProperties | undefined,
  rotate: number | undefined,
): CSSProperties => {
  const merged: CSSProperties = { ...style };
  if (rotate === undefined) {
    return merged;
  }

  const baseTransform = style?.transform ? `${style.transform} ` : '';
  merged.transform = `${baseTransform}rotate(${rotate}deg)`.trim();
  return merged;
};

const getPrimaryTwoToneColor = (
  twoToneColor: TwoToneColor | undefined,
): string | undefined => {
  if (!twoToneColor) {
    return undefined;
  }
  if (Array.isArray(twoToneColor)) {
    return twoToneColor[0];
  }
  return twoToneColor;
};

const Icon = forwardRef<HTMLSpanElement, IconProps>((props, ref) => {
  const {
    className,
    rotate,
    spin = false,
    style,
    component,
    twoToneColor,
    ...restProps
  } = props;
  const config = useIconConfig();
  const mergedStyle = mergeRotateStyle(style, rotate);
  const effectiveTwoToneColor =
    twoToneColor ?? config.defaultTwoToneColor ?? twoTonePrimaryColor;
  const primaryColor = getPrimaryTwoToneColor(effectiveTwoToneColor);

  if (primaryColor && !mergedStyle.color) {
    mergedStyle.color = primaryColor;
  }

  const classNames = ['anticon', className, getSpinClassName(spin)]
    .filter(Boolean)
    .join(' ');

  const iconProps: CustomIconComponentProps = {
    className: 'anticon',
    style: mergedStyle,
    rotate,
    spin,
    twoToneColor: effectiveTwoToneColor,
    fill: 'currentColor',
    width: '1em',
    height: '1em',
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
    <span ref={ref} className={classNames} style={mergedStyle} {...restProps}>
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

export const setTwoToneColor = (color: TwoToneColor): void => {
  const nextColor = Array.isArray(color) ? color[0] : color;
  if (!nextColor) {
    return;
  }
  twoTonePrimaryColor = nextColor;
  globalConfig = {
    ...globalConfig,
    defaultTwoToneColor: nextColor,
  };
};

export const getTwoToneColor = (): string => {
  return twoTonePrimaryColor;
};

export const createFromIconfontCN = (
  options: IconfontCNOptions,
): ComponentType<IconfontIconProps> => {
  const urls = normalizeScriptUrls(options.scriptUrl);
  const extraCommonProps = options.extraCommonProps ?? {};
  const { iconfontScriptUrlWhitelist } = getGlobalConfig();
  urls.forEach((url) => ensureIconfontScript(url, iconfontScriptUrlWhitelist));

  const IconfontIcon = forwardRef<HTMLSpanElement, IconfontIconProps>(
    (props, ref) => {
      const { type, spin, rotate, className, style, ...restProps } = props;
      const config = useIconConfig();

      useEffect(() => {
        urls.forEach((url) =>
          ensureIconfontScript(url, config.iconfontScriptUrlWhitelist),
        );
      }, [config.iconfontScriptUrlWhitelist]);

      const SvgComponent: React.FC<CustomIconComponentProps> = (
        svgProps: CustomIconComponentProps,
      ) => {
        return (
          <svg
            viewBox="0 0 1024 1024"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
            {...extraCommonProps}
            {...svgProps}
          >
            <use xlinkHref={`#${type}`} />
          </svg>
        );
      };

      SvgComponent.displayName = `Iconfont_${type}`;

      return (
        <Icon
          ref={ref}
          component={SvgComponent}
          className={['iconfont', `iconfont-${type}`, className]
            .filter(Boolean)
            .join(' ')}
          spin={spin}
          rotate={rotate}
          style={style}
          {...restProps}
        />
      );
    },
  );
  IconfontIcon.displayName = 'IconfontIcon';
  return IconfontIcon;
};

export const configureIcon = (config: IconGlobalConfig): void => {
  globalConfig = {
    ...globalConfig,
    ...config,
    iconfontScriptUrlWhitelist:
      config.iconfontScriptUrlWhitelist ??
      globalConfig.iconfontScriptUrlWhitelist,
  };

  if (config.defaultTwoToneColor) {
    setTwoToneColor(config.defaultTwoToneColor);
  }
};

export interface IconProviderProps {
  children: ReactNode;
  config?: IconGlobalConfig;
}

export const IconProvider = (props: IconProviderProps): JSX.Element => {
  const { children, config } = props;
  const value = useMemo<IconConfigContextValue>(() => {
    const merged: IconConfigContextValue = {
      ...getGlobalConfig(),
      ...config,
      iconfontScriptUrlWhitelist:
        config?.iconfontScriptUrlWhitelist ??
        getGlobalConfig().iconfontScriptUrlWhitelist,
    };
    return merged;
  }, [config]);

  return (
    <IconConfigContext.Provider value={value}>
      {children}
    </IconConfigContext.Provider>
  );
};

export default Icon;
