export enum STYLE_TYPES {
	object = 'object',
	objectArray = 'objectArray',
	function = 'function',
	number = 'number',
	numberArray = 'numberArray',
	string = 'string',
	stringArray = 'stringArray',
	enum = 'enum',
	json = 'json',
	boolean = 'boolean'
}



type StylesType={
	[key:string]:{
		type:string
		values?:any
	}
}
interface StyleCategoryType{
	[key:string]:StylesType

}
export const styleCategory:StyleCategoryType={
	Layout:{
		display:{
			type:STYLE_TYPES.enum,
			values:['flex']
		},
	},
'Edge Distance':{
	}

};


