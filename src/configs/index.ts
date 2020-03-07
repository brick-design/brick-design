import { htmlContainers, htmlNonContainers } from './htmlCategory';
import { reactContainers, reactNonContainers } from './reactCategory';
import * as Ants from 'antd/es';
import { ConfigType } from '@/types/ConfigTypes';
import AllComponentConfigs from './componentConfigs';

/**
 * 原始组件集
 */
const OriginalComponents = Ants;

/**
 * 容器组件分类
 */
const CONTAINER_CATEGORY = { ...reactContainers, ...htmlContainers };
/**
 * 非容器组件分类
 * @type {{Input, InputNumber, Slider, Checkbox, Rate, Radio, Icon, Typography}}
 */
const NON_CONTAINER_CATEGORY = { ...reactNonContainers, ...htmlNonContainers };

const iframeSrcDoc=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="referrer" content="no-referrer" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="./vendors.chunk.css">
    <link rel="stylesheet" href="./antdesigns.chunk.css">
    <link rel="stylesheet" href="./umi.css">
</head>
<body>
<div style="height: 100%" id="dnd-container">
</div>
</body>
</html>
`;

const config: ConfigType = {
  OriginalComponents,
  AllComponentConfigs,
  CONTAINER_CATEGORY,
  NON_CONTAINER_CATEGORY,
  iframeSrcDoc
};

export default config;
