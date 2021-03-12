import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'antd';
import map from 'lodash/map';
import filter from 'lodash/filter';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import { PROPS_TYPES, PropsConfigType } from '@brickd/react';
import SortComponent from './SortComponent';
import ObjectComponent from '../ObjectComponent/ObjectComponent';
import styles from '../../index.less';
import { confirmModal } from '../index';

interface ObjectArrayPropsType {
  value?: any;
  childPropsConfig: PropsConfigType[];
  type: PROPS_TYPES;
  fatherFieldLocation: string;
  field: string;
  onChange: (value: any) => void;
}

export interface PaneType {
  childPropsConfig: PropsConfigType;
  key: string;
  value: any;
}

const { TabPane } = Tabs;

function ObjectArrayComponent(props: ObjectArrayPropsType) {
  const {
    value,
    childPropsConfig,
    type,
    fatherFieldLocation,
    field,
    onChange,
  } = props;
  const nextTabIndex = useRef(0),
    childPropsConfigRef = useRef(childPropsConfig);

  const [activeKey, setActiveKey] = useState('object0');
  const [panes, setPanes] = useState(
    map(value, (v, index) => ({
      value: v,
      childPropsConfig: get(childPropsConfig, `[${index}]`, {}),
      key: `object${nextTabIndex.current++}`,
    })),
  );

  useEffect(() => {
    const resultData: any[] = [];
    for (const pane of panes) {
      if (!isEmpty(pane.value)) resultData.push(pane.value);
    }
    if (isEmpty(panes)) {
      childPropsConfigRef.current = [];
    } else {
      childPropsConfigRef.current = map(panes, (pane) => pane.childPropsConfig);
    }
    const timer = setTimeout(() => {
      onChange && onChange(resultData);
    }, 500);
    return () => clearTimeout(timer);
  }, [panes, type, field, fatherFieldLocation]);

  useEffect(() => {
    if (!isEqual(childPropsConfig, childPropsConfigRef.current)) {
      childPropsConfigRef.current = childPropsConfig;
      setPanes(
        map(panes, (v, i) => {
          v.childPropsConfig = get(
            childPropsConfig,
            `[${i}]`,
            childPropsConfig[0],
          );
          return v;
        }),
      );
    }
  }, [childPropsConfig]);

  function onEdit(targetKey: any, action: 'add' | 'remove') {
    const actionMap = {
      add: add,
      remove: remove,
    };
    actionMap[action](targetKey);
  }

  function add() {
    const key = `object${nextTabIndex.current++}`;
    setPanes([
      ...panes,
      {
        key,
        childPropsConfig: cloneDeep(get(childPropsConfig, '[0]', {})),
        value: {},
      },
    ]);
    setActiveKey(key);
  }

  function remove(targetKey: string) {
    confirmModal(() => removeTab(targetKey));
  }

  function removeTab(targetKey: string) {
    const nextPanes = filter(panes, (pane) => pane.key !== targetKey);
    if (activeKey === targetKey) {
      setActiveKey(get(nextPanes, '[0].key'));
    }
    if (nextPanes.length === 0) {
      nextTabIndex.current = 0;
    }
    setPanes(nextPanes);
  }

  function onDataChange(index: number, data: any) {
    const pane = panes[index];
    pane.value = data;
    setPanes([...panes]);
  }

  return (
    <div className={styles['children-container']}>
      {panes.length > 0 && (
        <SortComponent
          onSortChange={(sortPanes) => setPanes(sortPanes)}
          sortData={panes}
        />
      )}
      <Tabs
        onChange={(changeActiveKey: string) => setActiveKey(changeActiveKey)}
        activeKey={activeKey}
        type="editable-card"
        style={{ marginBottom: '12px' }}
        onEdit={onEdit}
      >
        {panes.map((pane, index) => {
          const { key, value, childPropsConfig } = pane;
          const tabTitle = isEmpty(value) ? key : value[Object.keys(value)[0]];
          return (
            <TabPane forceRender tab={tabTitle} key={key}>
              <ObjectComponent
                isHideDivider
                {...props}
                value={value}
                childPropsConfig={childPropsConfig}
                tabIndex={index}
                onChange={(data: any) => onDataChange(index, data)}
              />
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}

export default ObjectArrayComponent;
