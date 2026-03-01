import React, { type FC } from 'react';

const Button: FC<{ title: string; onClick?: () => void }> = (props) => (
  <button type="button" onClick={props.onClick}>
    {props.title}
  </button>
);

export default Button;
