import React from 'react';
import { Icon } from 'antd';

export default function MyIcon(props: any) {
  const { scriptUrl, ...rest } = props;
  const NewIcon = scriptUrl ? Icon.createFromIconfontCN({ scriptUrl }) : Icon;
  return <NewIcon {...rest}/>;
}
