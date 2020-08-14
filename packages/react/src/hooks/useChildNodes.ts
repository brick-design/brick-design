import { useEffect, useMemo } from 'react';
import {
	ChildNodesType,
	getComponentConfig,
	SelectedInfoBaseType,
} from '@brickd/core';
import { handleSelectedStatus } from '../common/events';

export interface UseChildNodeType {
	specialProps: SelectedInfoBaseType
	childNodes?: ChildNodesType
	componentName: string
}

export function useChildNodes({
	specialProps,
	childNodes,
	componentName,
}: UseChildNodeType) {
	const { nodePropsConfig, isRequired } = useMemo(
		() => getComponentConfig(componentName),
		[],
	);
	useEffect(() => {
		if (!childNodes) return;
		if (!Array.isArray(childNodes)) {
			for (const prop of Object.keys(nodePropsConfig!)) {
				const { isRequired } = nodePropsConfig![prop];
				if (isRequired && childNodes[prop]!.length === 0) {
					handleSelectedStatus(null, false, specialProps, prop);
					break;
				}
			}
		} else if (isRequired && childNodes.length === 0) {
			handleSelectedStatus(null, false, specialProps);
		}
	}, [childNodes]);
}
