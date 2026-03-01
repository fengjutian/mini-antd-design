import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

export type TextVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

export interface TypographyCopyableOption {
  text?: string;
  onCopy?: () => void;
}

export interface TypographyEditableOption {
  value?: string;
  onChange?: (val: string) => void;
  maxLength?: number;
  onEnd?: () => void;
}

export interface TypographyEllipsisOption {
  rows?: number;
  expandable?: boolean;
  tooltip?: boolean;
}

export interface TypographyLinkOption {
  href: string;
  target?: '_blank' | '_self';
}

export interface BaseTextOptions {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  variant?: TextVariant;
  copyable?: boolean | TypographyCopyableOption;
  editable?: boolean | TypographyEditableOption;
  ellipsis?: boolean | TypographyEllipsisOption;
  link?: TypographyLinkOption;
  disabled?: boolean;
  'data-testid'?: string;
}

export interface TitleProps extends BaseTextOptions {
  level?: 1 | 2 | 3 | 4 | 5;
}

export interface TypographyGlobalConfig {
  defaultEllipsisRows?: number;
  enableTooltipByDefault?: boolean;
  linkTarget?: '_blank' | '_self';
}

interface TypographyConfigContextValue {
  defaultEllipsisRows: number;
  enableTooltipByDefault: boolean;
  linkTarget: '_blank' | '_self';
}

interface AntdTypographyLike {
  Text?: React.ComponentType<Record<string, unknown>>;
  Title?: React.ComponentType<Record<string, unknown>>;
  Paragraph?: React.ComponentType<Record<string, unknown>>;
}

const defaultGlobalConfig: TypographyConfigContextValue = {
  defaultEllipsisRows: 1,
  enableTooltipByDefault: true,
  linkTarget: '_blank',
};

let globalConfig: TypographyConfigContextValue = { ...defaultGlobalConfig };

const TypographyConfigContext =
  createContext<TypographyConfigContextValue>(defaultGlobalConfig);

export function configureTypography(config: TypographyGlobalConfig): void {
  globalConfig = {
    ...globalConfig,
    ...config,
  };
}

const getGlobalConfig = (): TypographyConfigContextValue => {
  return globalConfig;
};

const isBrowser =
  typeof window !== 'undefined' && typeof document !== 'undefined';

const variantStyleMap: Record<TextVariant, CSSProperties> = {
  default: {},
  secondary: { color: 'rgba(0, 0, 0, 0.45)' },
  success: { color: '#52c41a' },
  warning: { color: '#faad14' },
  danger: { color: '#ff4d4f' },
};

const canUseHttpLink = (href: string): boolean => {
  return /^https?:\/\//i.test(href);
};

const toTextContent = (children: ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  return '';
};

const getAntdTypographyFromGlobal = (): AntdTypographyLike | null => {
  if (!isBrowser) {
    return null;
  }
  const maybeAntd = (window as unknown as { antd?: { Typography?: unknown } })
    .antd;
  if (maybeAntd && maybeAntd.Typography) {
    return maybeAntd.Typography as AntdTypographyLike;
  }
  return null;
};

const useTypographyConfig = (): TypographyConfigContextValue => {
  const contextValue = useContext(TypographyConfigContext);
  const hasProviderValue = contextValue !== defaultGlobalConfig;
  if (hasProviderValue) {
    return contextValue;
  }
  return getGlobalConfig();
};

const normalizeCopyable = (
  copyable: BaseTextOptions['copyable'],
  disabled: boolean | undefined,
  children: ReactNode,
): false | { text?: string; onCopy?: () => void; format: 'text/plain' } => {
  if (!copyable || disabled) {
    return false;
  }

  if (copyable === true) {
    return {
      text: toTextContent(children),
      format: 'text/plain',
    };
  }

  return {
    text: copyable.text,
    onCopy: copyable.onCopy,
    format: 'text/plain',
  };
};

const normalizeEditable = (
  editable: BaseTextOptions['editable'],
  disabled: boolean | undefined,
): false | TypographyEditableOption => {
  if (!editable || disabled) {
    return false;
  }
  if (editable === true) {
    return {};
  }
  return editable;
};

const normalizeEllipsis = (
  ellipsis: BaseTextOptions['ellipsis'],
  config: TypographyConfigContextValue,
): false | { rows: number; expandable: boolean; tooltip: boolean } => {
  if (!ellipsis) {
    return false;
  }

  if (ellipsis === true) {
    return {
      rows: config.defaultEllipsisRows,
      expandable: false,
      tooltip: config.enableTooltipByDefault,
    };
  }

  return {
    rows: ellipsis.rows ?? config.defaultEllipsisRows,
    expandable: Boolean(ellipsis.expandable),
    tooltip: ellipsis.tooltip ?? config.enableTooltipByDefault,
  };
};

const renderWithSafeLink = (
  content: ReactNode,
  link: TypographyLinkOption | undefined,
  disabled: boolean | undefined,
  config: TypographyConfigContextValue,
): ReactNode => {
  if (!link) {
    return content;
  }

  if (disabled) {
    return <span>{content}</span>;
  }

  const target = link.target ?? config.linkTarget;
  const isHttp = canUseHttpLink(link.href);

  if (!isHttp && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(
      `[Typography] Non-http(s) link detected: "${link.href}". This may be blocked.`,
    );
  }

  return (
    <a
      href={link.href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    >
      {content}
    </a>
  );
};

const useOverflowTitle = (
  ellipsis: false | { rows: number; expandable: boolean; tooltip: boolean },
  children: ReactNode,
): string | undefined => {
  if (!ellipsis || !ellipsis.tooltip) {
    return undefined;
  }
  return toTextContent(children) || undefined;
};

const Text = forwardRef<HTMLSpanElement, BaseTextOptions>((props, ref) => {
  const {
    children,
    className,
    style,
    variant = 'default',
    copyable,
    editable,
    ellipsis,
    link,
    disabled,
    'data-testid': dataTestId,
  } = props;

  const config = useTypographyConfig();
  const normalizedCopyable = normalizeCopyable(copyable, disabled, children);
  const normalizedEditable = normalizeEditable(editable, disabled);
  const normalizedEllipsis = normalizeEllipsis(ellipsis, config);
  const tooltipTitle = useOverflowTitle(normalizedEllipsis, children);
  const antdTypography = useMemo(getAntdTypographyFromGlobal, []);
  const AntdText = antdTypography?.Text;

  const [innerValue, setInnerValue] = useState<string>(toTextContent(children));
  const currentValue =
    normalizedEditable && normalizedEditable.value !== undefined
      ? normalizedEditable.value
      : innerValue;

  useEffect(() => {
    if (!normalizedEditable || normalizedEditable.value !== undefined) {
      return;
    }
    setInnerValue(toTextContent(children));
  }, [children, normalizedEditable]);

  const onCopyClick = async (): Promise<void> => {
    if (!normalizedCopyable || !isBrowser) {
      return;
    }
    const textToCopy = normalizedCopyable.text ?? currentValue;
    if (!textToCopy) {
      return;
    }
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(textToCopy);
      normalizedCopyable.onCopy?.();
    }
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextValue = event.target.value;
    if (
      normalizedEditable &&
      normalizedEditable.maxLength &&
      nextValue.length > normalizedEditable.maxLength
    ) {
      return;
    }
    if (!normalizedEditable || normalizedEditable.value === undefined) {
      setInnerValue(nextValue);
    }
    if (normalizedEditable) {
      normalizedEditable.onChange?.(nextValue);
    }
  };

  if (AntdText) {
    const antdNode = (
      <AntdText
        ref={ref as unknown as React.Ref<HTMLElement>}
        className={className}
        style={{
          ...variantStyleMap[variant],
          ...style,
        }}
        type={variant === 'default' ? undefined : variant}
        disabled={disabled}
        copyable={normalizedCopyable}
        editable={normalizedEditable}
        ellipsis={
          normalizedEllipsis
            ? {
                rows: normalizedEllipsis.rows,
                expandable: normalizedEllipsis.expandable,
                tooltip: normalizedEllipsis.tooltip,
              }
            : false
        }
        data-testid={dataTestId}
      >
        {children}
      </AntdText>
    );
    return <>{renderWithSafeLink(antdNode, link, disabled, config)}</>;
  }

  const baseNode = normalizedEditable ? (
    <input
      ref={ref as unknown as React.Ref<HTMLInputElement>}
      className={className}
      style={{
        ...variantStyleMap[variant],
        ...style,
      }}
      value={currentValue}
      disabled={disabled}
      maxLength={normalizedEditable.maxLength}
      title={tooltipTitle}
      data-testid={dataTestId}
      onChange={onInputChange}
      onBlur={normalizedEditable.onEnd}
    />
  ) : (
    <span
      ref={ref}
      className={className}
      style={{
        ...variantStyleMap[variant],
        ...style,
      }}
      title={tooltipTitle}
      data-testid={dataTestId}
    >
      {children}
    </span>
  );

  const withLink = renderWithSafeLink(baseNode, link, disabled, config);

  if (normalizedCopyable) {
    return (
      <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
        {withLink}
        <button type="button" onClick={onCopyClick} disabled={disabled}>
          Copy
        </button>
      </span>
    );
  }

  return <>{withLink}</>;
});

Text.displayName = 'TypographyText';

const Title = forwardRef<HTMLHeadingElement, TitleProps>((props, ref) => {
  const {
    children,
    className,
    style,
    variant = 'default',
    copyable,
    editable,
    ellipsis,
    link,
    disabled,
    level = 1,
    'data-testid': dataTestId,
  } = props;
  const config = useTypographyConfig();
  const normalizedCopyable = normalizeCopyable(copyable, disabled, children);
  const normalizedEditable = normalizeEditable(editable, disabled);
  const normalizedEllipsis = normalizeEllipsis(ellipsis, config);
  const tooltipTitle = useOverflowTitle(normalizedEllipsis, children);
  const antdTypography = useMemo(getAntdTypographyFromGlobal, []);
  const AntdTitle = antdTypography?.Title;
  const headingTag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' = `h${level}`;

  if (AntdTitle) {
    const antdNode = (
      <AntdTitle
        ref={ref as unknown as React.Ref<HTMLElement>}
        level={level}
        className={className}
        style={{
          ...variantStyleMap[variant],
          ...style,
        }}
        type={variant === 'default' ? undefined : variant}
        disabled={disabled}
        copyable={normalizedCopyable}
        editable={normalizedEditable}
        ellipsis={
          normalizedEllipsis
            ? {
                rows: normalizedEllipsis.rows,
                expandable: normalizedEllipsis.expandable,
                tooltip: normalizedEllipsis.tooltip,
              }
            : false
        }
        data-testid={dataTestId}
      >
        {children}
      </AntdTitle>
    );
    return <>{renderWithSafeLink(antdNode, link, disabled, config)}</>;
  }

  const baseNode = React.createElement(
    headingTag,
    {
      ref,
      className,
      style: {
        ...variantStyleMap[variant],
        ...style,
      },
      title: tooltipTitle,
      'data-testid': dataTestId,
    },
    children,
  );

  return <>{renderWithSafeLink(baseNode, link, disabled, config)}</>;
});

Title.displayName = 'TypographyTitle';

const Paragraph = forwardRef<HTMLParagraphElement, BaseTextOptions>(
  (props, ref) => {
    const {
      children,
      className,
      style,
      variant = 'default',
      copyable,
      editable,
      ellipsis,
      link,
      disabled,
      'data-testid': dataTestId,
    } = props;
    const config = useTypographyConfig();
    const normalizedCopyable = normalizeCopyable(copyable, disabled, children);
    const normalizedEditable = normalizeEditable(editable, disabled);
    const normalizedEllipsis = normalizeEllipsis(ellipsis, config);
    const tooltipTitle = useOverflowTitle(normalizedEllipsis, children);
    const antdTypography = useMemo(getAntdTypographyFromGlobal, []);
    const AntdParagraph = antdTypography?.Paragraph;

    if (AntdParagraph) {
      const antdNode = (
        <AntdParagraph
          ref={ref as unknown as React.Ref<HTMLElement>}
          className={className}
          style={{
            ...variantStyleMap[variant],
            ...style,
          }}
          type={variant === 'default' ? undefined : variant}
          disabled={disabled}
          copyable={normalizedCopyable}
          editable={normalizedEditable}
          ellipsis={
            normalizedEllipsis
              ? {
                  rows: normalizedEllipsis.rows,
                  expandable: normalizedEllipsis.expandable,
                  tooltip: normalizedEllipsis.tooltip,
                }
              : false
          }
          data-testid={dataTestId}
        >
          {children}
        </AntdParagraph>
      );
      return <>{renderWithSafeLink(antdNode, link, disabled, config)}</>;
    }

    const baseNode = (
      <p
        ref={ref}
        className={className}
        style={{
          ...variantStyleMap[variant],
          ...style,
        }}
        title={tooltipTitle}
        data-testid={dataTestId}
      >
        {children}
      </p>
    );
    return <>{renderWithSafeLink(baseNode, link, disabled, config)}</>;
  },
);

Paragraph.displayName = 'TypographyParagraph';

export interface TypographyProviderProps {
  children: ReactNode;
  config?: TypographyGlobalConfig;
}

export const TypographyProvider = (
  props: TypographyProviderProps,
): JSX.Element => {
  const { children, config } = props;
  const value = useMemo<TypographyConfigContextValue>(() => {
    return {
      ...getGlobalConfig(),
      ...config,
    };
  }, [config]);

  return (
    <TypographyConfigContext.Provider value={value}>
      {children}
    </TypographyConfigContext.Provider>
  );
};

export interface TypographyAPI {
  Text: typeof Text;
  Title: typeof Title;
  Paragraph: typeof Paragraph;
  Provider: typeof TypographyProvider;
}

const Typography: TypographyAPI = {
  Text,
  Title,
  Paragraph,
  Provider: TypographyProvider,
};

export default Typography;
