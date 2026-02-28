import React, { type FC } from 'react';

const Button: FC<{ title: string; onClick?: () => void }> = (props) => (
  <h4 onClick={props.onClick}>{props.title}</h4>
);

export default Button;
