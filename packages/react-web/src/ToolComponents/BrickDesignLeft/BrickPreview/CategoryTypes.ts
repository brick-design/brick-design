/**
 * 定义组件的分类数据结构，目的是为了更好的在组件预览面板做组件的展示搜索与约束
 */

export interface ComponentCategoryType {
  // 组件预览面板为grid布局通过设置span值来分配各个组件中展示组件所占位置大小，数值0-24
  span?: number;
  // 默认属性配置，组件预览面板会将默认属性分别展示出来，在拖拽组件时会携默认属性到页面中
  props?: any[];
}

export interface ComponentInfoType {
  // 如果组件没有次级组件（次级组件定义类似Layout.Footer）
  //时就可以认定，分类名称即为组件名称
  span?: number;
  props?: any[];
  components?: {
    [componentName: string]: ComponentCategoryType | null;
  };
}

export interface CategoryType {
  //组件分类，如果组件没有次级组件，并且无法为其设置默认属性，时可直接设置其值为null，类别名必须为组件名
  [category: string]: ComponentInfoType | null;
}
