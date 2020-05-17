import React, { memo, useEffect, useState } from 'react';
import { Collapse, Dropdown, Icon, Menu } from 'antd';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import SortTree from './SortTree';
import styles from './index.less';
import { controlUpdate, usePrevious } from '../utils';
import {
    ChildNodesType,
    clearChildNodes,
    ComponentConfigsType,
    copyComponent,
    deleteComponent,
    LEGO_BRIDGE,
    NodeProps,
    NodePropsConfigType,
    SelectedInfoBaseType,
    SelectedInfoType,
    useSelector,
} from 'brickd-core';
import { getDropTargetInfo, handleSelectedStatus, onMouseOver, selectedStatus } from 'brickd';
import domTreeIcons from './domTreeIcons';


const {Panel} = Collapse;
const {Item} = Menu;

interface SortItemPropsType {
    isFold?: boolean,
    propChildNodes?: string[],
    specialProps: SelectedInfoBaseType,
    propName?: string,
    nodeProps?:NodeProps
}

const handleMenuClick = (e: any) => {
    switch (e.key) {
        case '1':
            return clearChildNodes();
        case '2':
        case '3':
            return copyComponent();
        case '4':
            return deleteComponent();
    }
};

function renderMenu(domKey: string, isOnlyNode?: boolean, isClear?: boolean) {
    let isRoot = domKey === 'root'
    return (
        <Menu onClick={handleMenuClick}>
            {isClear && <Item key={1}>清除</Item>}
            {!isRoot && !isOnlyNode && <Item key={3}>复制</Item>}
            {!isRoot && <Item key={4}>删除</Item>}
        </Menu>);
};


function getIcon(name: string) {
    if (get(domTreeIcons, `${name}`)) return get(domTreeIcons, `${name}`);
    return domTreeIcons.Layout;
};

/**
 * 渲染页面结构节点
 * @returns {*}
 */
function renderHeader(isUnfold: boolean,
                      props: SortItemPropsType,
                      isSelected: boolean,
                      isHovered: boolean,
                      setIsUnfold: any,
                      componentName: string,
                      childNodes?: ChildNodesType) {
    const { specialProps, specialProps: {key}} = props;
    const selectedColor = '#5E96FF';
    const unSelectedColor = '#555555';
    const selectedBGColor = '#F2F2F2';
    const hoveredBGColor = '#F1F1F1';
    const color = isSelected ? selectedColor : unSelectedColor;
    let propName=props.propName
    if(childNodes&&!Array.isArray(childNodes)) {
        propName=Object.keys(childNodes)[0]
    }
    return (
        <div
            style={{backgroundColor: isSelected ? selectedBGColor : isHovered ? hoveredBGColor : '#0000'}}
            className={styles['header-container']}
        >
            <div onClick={() => handleSelectedStatus(null, isSelected, specialProps, propName)}
                 onMouseOver={(e: any) => onMouseOver(e, propName?`${key}${propName}`:key)}
                 style={{display: 'flex', flex: 1, alignItems: 'center', color}}>
                <Icon
                    className={isUnfold ? styles.rotate90 : ''}
                    style={{
                        padding: 5,
                        fontSize: 16,
                        transition: 'all 0.2s',
                        color: !isEmpty(childNodes) ? unSelectedColor : '#0000',
                    }}
                    type="caret-right"
                    onClick={(event) => {
                        event.stopPropagation();
                        setIsUnfold(!isUnfold);
                    }
                    }
                />
                <Icon component={getIcon(componentName)} style={{marginRight: 7}}/>
                <span>{componentName}</span>
            </div>
            {
                isSelected &&
                <Dropdown
                    trigger={['click']}
                    overlay={renderMenu(key)}
                >
                    <Icon component={getIcon('more')} style={{color}}/>
                </Dropdown>
            }
        </div>
    );
}

/**
 * 渲染子组件或者属性节点
 * @returns {Array|*}
 */
function renderSortTree(props: SortItemPropsType, childNodes: ChildNodesType, isUnfold: boolean,componentName:string,nodePropsConfig?:NodePropsConfigType) {
    const {
        specialProps,
        specialProps: {key, domTreeKeys},
        propName,
        nodeProps
    } = props;
    if (isArray(childNodes)) {
        return (<SortTree
            isFold={!isUnfold}
            childNodes={childNodes}
            propName={propName}
            specialProps={specialProps}
            nodeProps={nodeProps}
            componentName={componentName}
        />);
    }

    /**
     * 处理属性节点子组件
     */
    return map(childNodes, (propChildNodes, propName) => {
        const propKey = `${key}${propName}`;
        return <SortItem
            {...props}
            propChildNodes={propChildNodes}
            specialProps={{...specialProps, domTreeKeys: [...domTreeKeys, propKey]}}
            propName={propName}
            key={propName}
            nodeProps={nodePropsConfig![propName]}
        />;
    });

}


export type HookState = {
    selectedInfo: SelectedInfoType,
    hoverKey: string,
    componentConfigs: ComponentConfigsType
}

export const stateSelector=['selectedInfo', 'hoverKey','componentConfigs']

function SortItem(props: SortItemPropsType) {
    const {
        specialProps: {key,parentPropName,parentKey,domTreeKeys},
        isFold,
        propName,
        propChildNodes,
    } = props;

    const {selectedInfo, hoverKey, componentConfigs} = useSelector<HookState>(stateSelector,
        (prevState,nextState)=>controlUpdate(prevState,nextState,key))
    const {selectedKey, domTreeKeys: nextSDTKeys, propName: selectedPropName} = selectedInfo || {};
    const {isHovered, isSelected} = selectedStatus(propName?`${key}${propName}`:key, hoverKey,
        selectedPropName?`${selectedKey}${selectedPropName}`:selectedKey);
    const vDom = componentConfigs[key]
    const {childNodes: vDomChildNodes, componentName} = vDom||{}
    const childNodes: ChildNodesType | undefined = propChildNodes || vDomChildNodes
    const [isUnfold, setIsUnfold] = useState(true);
    // 保存子组件dom
    const prevChildNodes = usePrevious<ChildNodesType>(childNodes);

    const prevSDTKeys = usePrevious(nextSDTKeys)

    //新添加组件展开
    useEffect(() => {
        if (!isUnfold && Array.isArray(prevChildNodes) && (childNodes as string[]).length > prevChildNodes.length) {
            setIsUnfold(true);
        }
    }, [prevChildNodes, childNodes, isUnfold]);


    // 父节点折叠当前节点是展开的就折叠当前节点
    useEffect(() => {
        if (isFold && isUnfold) setIsUnfold(false);
    }, [isFold, isUnfold])

    if(!componentName) return null
    if (!isEqual(prevSDTKeys, nextSDTKeys) && nextSDTKeys && !isUnfold && nextSDTKeys.includes(key)) {
        setIsUnfold(true);
    }

    const {fatherNodesRule,nodePropsConfig} = get(LEGO_BRIDGE.config!.AllComponentConfigs, componentName);

    return (
        <div
            className={styles['sort-item']}
            id={key}
            data-special={JSON.stringify({key,parentPropName,parentKey})}
            data-farules={fatherNodesRule&&JSON.stringify(fatherNodesRule)}
            data-name={componentName}
            onDragEnter={(e: any) => {
                //如果目标组件为非容器组件就重置目标容器信息
                if (!childNodes) return getDropTargetInfo(e)
                let propNameResult = propName
                //如果当前目标是多属性节点容器，获取容器的最后一属性节点作为目标容器
                if (!propNameResult && !isArray(childNodes)) {
                    propNameResult = Object.keys(childNodes).pop()
                }
                getDropTargetInfo(e, domTreeKeys,key, propNameResult)
            }}
        >
            {renderHeader(isUnfold, props, isSelected, isHovered, setIsUnfold, propName || componentName, childNodes)}

            {childNodes&&<Collapse
                activeKey={isUnfold ? ['1'] : []}
                style={{marginLeft: 24}}
                bordered={false}
            >
                <Panel showArrow={false} key={'1'} header={<div/>} style={{border: 0, backgroundColor: '#fff'}}>
                    {renderSortTree(props, childNodes, isUnfold,componentName,nodePropsConfig)}
                </Panel>
            </Collapse>}
        </div>
    );
}


export default memo<SortItemPropsType>(SortItem);
