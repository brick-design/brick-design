import { htmlContainers, htmlNonContainers } from './htmlCategory';
import { reactContainers, reactNonContainers } from './reactCategory';
import * as Ants from 'antd/es';
import { ConfigType } from '@/types/ConfigTypes';
import AllComponentConfigs from './componentConfigs';
import * as customComponents from '../customComponents'

/**
 * 原始组件集
 */
const OriginalComponents = {...Ants,...customComponents};

/**
 * 容器组件分类
 */
const CONTAINER_CATEGORY = { ...reactContainers, ...htmlContainers };
/**
 * 非容器组件分类
 * @type {{Input, InputNumber, Slider, Checkbox, Rate, Radio, Icon, Typography}}
 */
const NON_CONTAINER_CATEGORY = { ...reactNonContainers, ...htmlNonContainers };

/**
 * 设计面板iframe 模板，如果集成到项目中，需要将拖拽组件所依赖的样式在模板中设置，
 * 否则设计面板渲染的页面将是无样式的效果
 */
const iframeSrcDoc = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="referrer" content="no-referrer" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
     <title></title>
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
  iframeSrcDoc,
};

export default config;
