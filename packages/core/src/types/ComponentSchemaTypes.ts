import { NODE_PROPS_TYPES, PROPS_TYPES } from './ConfigTypes';

/**
 * 组件属性的配置信息
 */
export interface PropsConfigType {
  [propName: string]: PropInfoType;
}

/**
 * 单个属性的具体配置
 */
export interface PropInfoType {
  //属性展示的文字
  label?: string;
  //属性的类型
  type: PROPS_TYPES | PROPS_TYPES[];
  //属性的功能的描述信息
  tip?: string;
  //当类型为object或者objectArray时，我们定义该类型的值为子属性值，子属性类型完全与配置完全与属性配置一样
  //当类型为object时其配置信息为一个类型为PropsConfigType的对象
  //当类型为objectArray时其配置为一个类型为PropsConfigType的数组对象
  childPropsConfig?: PropsConfigType | PropsConfigType[];
  //表示该属性是否为添加属性，在属性设置面板中类型为object的属性，可以动态添加和删除子属性，
  // 只有属性面板中动态添加的属性才会有这个字段，组件原始配置信息，不需要配置此字段
  isAdd?: boolean;
  // 规则，其实就是antd 的form规则，属性配置面板本身就是一个纯表单，组件的属性有时会需要必填，或者做值校验等，其值完全与antd的form一样
  rules?: any[];
  // 当类型为function时用于做方法的展示和代码生成时方法的生成，同时设计面板与预览面板也会使用eval来执行默认方法，以防部分组件报错，
  //因为无法在页面填写可执行的方法，所以function类型的属性只看已填写方法名，代码生成时会将名与方法体整合生成方法代码。
  //该值必须为可执行的方法字符串，如果不填写，设计面板与预览解析时如果该属性有值，就会默认执行一个空方法
  placeholder?: string;
  // 当类型为enum 时用于填写可选的值
  enumData?: string[];
  // 属性的默认值
  defaultValue?: any;
  // 类型为number并且属性值为number+单位比如 12px，12%等可以设置此属性为true
  hasUnit?: boolean;
  // 类型为string时有时会是颜色这时设置此值为true就可以使用颜色面板
  isShowColor?: boolean;
  inputColProps?: any;
  //类型为numberArray时设置其最大可以填写的个数
  maxTagCount?: number;
  //类型为number时设置number 的最小值
  min?: number;
  //类型为number时设置number 的最大值
  max?: number;
  //类型为stringArray时设置其最大可填写的个数
  stringCount?: number;
  //因为每个属性在属性设置面板都是以一个formItem的形式可视化的展示的，
  // 所以你可以设置当前属性在属性设置面板中formItem的一些特性，可参考antd form.Item设置
  formItemProps?: any;
  unDelete?: boolean;
  isRequired?: boolean;
}

/**
 * 节点属性配置信息，节点属性是这样定义的，一个属性的值可为html标签或者react组件的属性就是节点属性
 * react的子节点嵌套实际是将子节点作为属性children的值，所以children也可以作为属性节点配置
 */
export interface NodeProps {
  // 节点属性的类型，只可以填写reactNode和functionReactNode
  type: NODE_PROPS_TYPES.reactNode | NODE_PROPS_TYPES.functionReactNode;
  // 节点属性的功能描述，在都dom树面板hover单属性上会显示
  tip?: string;
  //节点属性的文字展示，不填写默认展示属性名
  label?: string;
  //节点属性的组件约束，表示该节点属性只可以放入的组件
  childNodesRule?: string[];
  //节点属性是否必填
  isRequired?: boolean;
  //节点属性的值是否为单节点
  isOnlyNode?: boolean;
  //节点属性类型为functionReactNode，时其参数信息
  params?: string[];
}

export interface NodePropsConfigType {
  [propName: string]: NodeProps;
}

/**
 * 弹窗类组件配置显示映射，目的是为了将弹窗类的组件展示约束到设计面板中去
 */
export interface MirrorModalFieldType {
  // 控制显示的属性字段（比如：Modal的visible）
  displayPropName?: string;
  // 挂载组件的配置信息
  mounted?: {
    //挂载组件的属性的名 (比如Modal的getContainer)
    propName: string;
    //挂载组件的属性的类型
    type: PROPS_TYPES.function | PROPS_TYPES.string;
  };
  // 需要修改样式才能挂载的情况（比如antd 的Drawer组件其默认样式为 position: 'fixed',无法挂载到设计面板上，需要改成 position: 'absolute'）
  style?: any;
}

/**
 * 组件配置的数据结构
 */

export interface ComponentSchemaType
  extends Omit<NodeProps, 'type' | 'tip' | 'params' | 'label'> {
  //父组件约束，许多组件只能作为特定组件的子组件，这些组件需要设置，父组件约束放置放错，导致错误显示或者报错，
  //注意要明确约束到父组件的节点属性
  isNonContainer?: boolean;
  fatherNodesRule?: string[];
  nodePropsConfig?: NodePropsConfigType;
  mirrorModalField?: MirrorModalFieldType;
  propsConfig: PropsConfigType;
}
