/**
 * 属性值类型定义
 */

export enum PROPS_TYPES {
    object = 'object',
    objectArray = 'objectArray',
    function = 'function',
    number = 'number',
    numberArray = 'numberArray',
    string = 'string',
    stringArray = 'stringArray',
    enum = 'enum',
    json = 'json',
    boolean = 'boolean',
    reactNode = 'reactNode',
    functionReactNode = 'functionReactNode',
    animate = 'animate',
}

/**
 *
 */
export interface PropInfoType {
    //属性展示的文字
    label: string,
    //属性的类型
    type: PROPS_TYPES | PROPS_TYPES[],
    //属性的功能的描述信息
    tip?: string,
    //当类型为object或者objectArray时，我们定义该类型的值为子属性值，子属性类型完全与配置完全与属性配置一样
    //当类型为object时其配置信息为一个类型为PropsConfigType的对象
    //当类型为objectArray时其配置为一个类型为PropsConfigType的数组对象
    childPropsConfig?: PropsConfigType | PropsConfigType[],
    //表示该属性是否为添加属性，在属性设置面板中类型为object的属性，可以动态添加和删除子属性，
    // 只有属性面板中动态添加的属性才会有这个字段，组件原始配置信息，不需要配置此字段
    isAdd?: boolean,
    // 规则，其实就是antd 的form规则，属性配置面板本身就是一个纯表单，组件的属性有时会需要必填，或者做值校验等，其值完全与antd的form一样
    rules?: any[],
    // 当类型为function时用于做方法的展示和代码生成时方法的生成，同时设计面板与预览面板也会使用eval来执行默认方法，以防部分组件报错，
    //因为无法在页面填写可执行的方法，所以function类型的属性只看已填写方法名，代码生成时会将名与方法体整合生成方法代码。
    //该值必须为可执行的方法字符串，如果不填写，设计面板与预览解析时如果该属性有值，就会默认执行一个空方法
    placeholder?: string,
    // 当类型为enum 时用于填写可选的值
    enumData?: string[],
    // 属性的默认值
    defaultValue?: any,
    // 类型为number并且属性值为number+单位比如 12px，12%等可以设置此属性为true
    hasUnit?: boolean,
    // 类型为string时有时会是颜色这时设置此值为true就可以使用颜色面板
    isShowColor?: boolean,
    inputColProps?: any,
    //类型为numberArray时设置其最大可以填写的个数
    maxTagCount?: number,
    //类型为number时设置number 的最小值
    min?: number,
    //类型为number时设置number 的最大值
    max?: number,
    //类型为stringArray时设置其最大可填写的个数
    stringCount?: number,
    //因为每个属性在属性设置面板都是以一个formItem的形式可视化的展示的，
    // 所以你可以设置当前属性在属性设置面板中formItem的一些特性，可参考antd form.Item设置
    formItemProps?: any

}

/**
 * 属性配置信息定义
 */
export interface PropsConfigType {
    [propName: string]: PropInfoType
}

export type PropsNodeType= {
    [propName: string]: string[]
}

export type ChildNodesType=string[] | PropsNodeType

export interface ParentNodeInfo {
    parentKey:string,
    parentPropName?:string,
}
export interface VirtualDOMType {
    componentName: string,
    props: any,
    addPropsConfig?: string,
    childNodes?:ChildNodesType
}

export interface SelectedInfoType extends ParentNodeInfo{
    selectedKey: string,
    propName?: string,
    domTreeKeys?: string[],


}

export interface PropsSettingType {
    props: any,
    propsConfig: PropsConfigType,
    mergePropsConfig: PropsConfigType,
    addPropsConfig: PropsConfigType,
}

export interface DragSourceType extends ParentNodeInfo{
    vDOMCollection?: ComponentConfigsType,
    dragKey?: string,
    defaultProps?:any
}

export interface TemplateInfoType {
    img: string,
    id: string,
    name: string,
    config: string
}

export interface DropTargetType {
    selectedKey:string
    propName: string,
}

export type PlatformStyleType = (number|string)[]

export interface PlatformInfoType {
    isMobile: boolean,
    size: PlatformStyleType,
}
export interface PropsConfigSheetType {
    [componentKey:string]:PropsConfigType
}

export interface ComponentConfigsType{
    [key:string]:VirtualDOMType
}

export interface StateType {
    componentConfigs:ComponentConfigsType,
    selectedInfo: SelectedInfoType | null,
    propsSetting: PropsSettingType | null,
    styleSetting: any,
    undo: any[],
    redo: any[],
    templateInfos: TemplateInfoType[],
    hoverKey: null | string,
    dragSource: DragSourceType | null,
    dropTarget: null | DropTargetType,
    platformInfo: PlatformInfoType,
    propsConfigSheet?:PropsConfigSheetType
}
