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
			values:['flex','inline','block','inline-block','none']
		},
		flexDirection:{
			type:STYLE_TYPES.enum,
			values:['row','row-reverse','column','column-reverse']
		},
		justifyContent:{
			type:STYLE_TYPES.enum,
			values:['flex-start','flex-end','center','space-between','space-around']
		},
		alignItems: {
			type: STYLE_TYPES.enum,
			values: ['flex-start', 'flex-end', 'center', 'baseline', 'stretch'],
		},
			flexWrap:{
				type: STYLE_TYPES.enum,
				values: ['nowrap', 'wrap', 'wrap-reverse'],
			},
	},
'Edge Distance':{

	}

};


