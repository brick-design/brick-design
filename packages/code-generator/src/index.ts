import {parse} from '@babel/parser';

export function brickAST(code:string){
	return parse(code,{
		plugins:[
			'jsx'
		]
	})
}
