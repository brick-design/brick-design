
export interface ComponentPropsType {
  describeInfo?:string,
  [propName:string]:any
}

export interface ComponentInfoType {
  span?:number,
  props?:ComponentPropsType[],
  components?:{
    [componentName:string]:any
  }
}

export interface CategoryType {
  [category:string]:ComponentInfoType
}
