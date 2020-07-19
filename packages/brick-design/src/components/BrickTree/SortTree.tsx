import React, { useCallback,memo } from 'react';
import {map,isEqual} from 'lodash'
import styles from './index.less';
import SortItem from './SortItem';
import { NodeProps, onLayoutSortChange, SelectedInfoBaseType } from 'brickd-core';
import ReactSortable from './components/ReactSortable';

interface SortTreePropsType {
    isFold?: boolean,
    childNodes: string[],
    currentName?: string,
    disabled?: boolean,
    specialProps:SelectedInfoBaseType,
    propName?:string,
    nodeProps?:NodeProps,
    componentName:string
}

/**
 * 渲染排序节点
 * @param key
 * @param props
 */
function renderSortItems(key:string, props: SortTreePropsType) {
    const {isFold,propName:parentPropName, specialProps:{domTreeKeys=[],key:parentKey}} = props;
    return (<SortItem
                      isFold={isFold}
                      key={key}
                      specialProps={{domTreeKeys:[...domTreeKeys, key],key,parentKey,parentPropName}}
    />);
}


const putItem = (c: any, props: SortTreePropsType) => {
    const { childNodes = [],nodeProps,componentName} = props;
    const  fatherNodesRule= c.dataset.farules;
    const dragName=c.dataset.name
    if(fatherNodesRule&&!JSON.parse(fatherNodesRule).include(componentName)) return false
    if(nodeProps){
        if ( nodeProps.isOnlyNode&&childNodes.length === 1) return false;
        if (nodeProps.childNodesRule) {
            return nodeProps.childNodesRule.includes(dragName);
        }
    }

    return true;
};


function SortTree(props: SortTreePropsType) {
    const {
        childNodes,
        disabled,
        specialProps:{
            key
        },
        propName
    } = props;

    /**
     * 拖拽排序
     * @param sortKeys
     * @param evt
     * @param props
     */
    const layoutSortChange = useCallback(function (sortKeys:string[],evt) {
        if(isEqual(childNodes,sortKeys)||sortKeys.length<childNodes.length) return
        /**
         * 获取拖住节点的信息
         * @type {any}
         */
        let dragInfo:any
        if(sortKeys.length>childNodes.length){
            dragInfo= JSON.parse(evt.clone.dataset.special)
        }
        onLayoutSortChange({
            sortKeys,
            parentKey:key,
            parentPropName:propName!,
            dragInfo
        })

    }, [childNodes]);
    return (
        <ReactSortable
            options={{
                group: { name: 'nested', put: (a: any, b: any, c: any)=>putItem(c,props) },
                animation: 200,
                disabled,
                dataIdAttr: 'id',
                ghostClass: styles['item-background'],
                swapThreshold: 0.5,
            }}
            onChange={layoutSortChange}
        >
            {map(childNodes, (key) => renderSortItems(key, props))}
        </ReactSortable>

    );
}

export default memo(SortTree);
