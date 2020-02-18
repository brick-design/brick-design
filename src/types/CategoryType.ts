
export interface ComponentCategoryType {
  span?:number,
  props?:any[],
}

export interface ComponentInfoType {
  span?:number,
  props?:any[],
  components?:{
    [componentName:string]:ComponentCategoryType|null
  }
}

export interface CategoryType {
  [category:string]:ComponentInfoType|null
}
