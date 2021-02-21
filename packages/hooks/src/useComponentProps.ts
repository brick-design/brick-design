import { dataMapping } from '@brickd/utils';

export function useComponentProps(prevProps:any,pageState:any){

	return dataMapping(prevProps,pageState);
}
