
interface propType{
  [propName:string]:any
}

export interface ComponentCategoryType {
  span?:number,  // grid部分分配数
  props?:propType[], // 默认属性配置
}

export interface ComponentInfoType {
  span?:number,
  props?:propType[],
  components?:{
    [componentName:string]:ComponentCategoryType|null
  }
}

export interface CategoryType {
  [category:string]:ComponentInfoType|null
}
