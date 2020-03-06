import React, { memo, useEffect, useState } from 'react';
import { Input, Modal, Spin } from 'antd';
import map from 'lodash/map';
import ListItem from './listItem';
import { ACTION_TYPES } from '@/models';
import styles from '../index.less';
import { Dispatch } from 'redux';
import { TemplateInfoType } from '@/types/ModelType';

const DELETE_TEMPLATE = '您确定要删除此模板？';

interface TemplatePanelPropsType {
  dispatch: Dispatch,
  isShow: boolean,
  templateInfos: TemplateInfoType[]
}


function TemplatePanel(props: TemplatePanelPropsType) {
  const { dispatch, templateInfos } = props;
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.getTemplateList,
    });
  }, []);

  function previewImg(newImgSrc: string) {
    setImgSrc(newImgSrc);
    setPreviewVisible(true);
  };

  function deleteItem(id: string) {
    Modal.confirm({
      content: DELETE_TEMPLATE,
      onOk() {
        dispatch({
          type: ACTION_TYPES.deleteTemplate,
          payload: { id },
        });
      },
    });

  };


  function onSearch(e: any) {
    const searchValue = e.target.value;
    dispatch({
      type: searchValue ? ACTION_TYPES.searchTemplate : ACTION_TYPES.getTemplateList,
      payload: {
        searchValue,
      },
    });

  }

  return (
    <>
      <Input.Search onPressEnter={onSearch}/>
      <Spin spinning={loading}>
        <div className={styles['all-components']}>
          {map(templateInfos, val => {
            const item = { templateData: JSON.parse(val.config) };
            return <ListItem key={val.id}
                             dispatch={dispatch}
                             item={item}
                             deleteItem={deleteItem}
                             previewImg={previewImg}
                             itemData={val}/>;
          })}
        </div>
      </Spin>
      <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
        <img alt="example" style={{ width: '100%', height: 500 }} src={imgSrc}/>
      </Modal>
    </>
  );
}

export default memo<TemplatePanelPropsType>(TemplatePanel, (_, nextProps) => !nextProps.isShow);
