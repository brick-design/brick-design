import React, { memo, useState } from 'react';
import styles from './index.less';
import { PreviewContext } from './PreviewContext';
import {searchIcon} from '../../../assets';
import Input, { InputProps } from '../../../Components/Input';
import Checkbox from '../../../Components/Checkbox';

type SearchBarProps = InputProps

function SearchBar(props: SearchBarProps) {
  const { children, ...rest } = props;
  const [isChecked, setIsChecked] = useState(false);

  const onCheckedChange = (v: boolean) => {
    setIsChecked(v);
  };

  return (
    <>
      <div className={styles['search-container']}>
        <img src={searchIcon} className={styles['icon']} />
        <Input
          placeholder={'搜索'}
          className={styles['search-input']}
          {...rest}
        />
        <Checkbox onChange={onCheckedChange} />
      </div>
      <PreviewContext.Provider value={isChecked}>
        {children}
      </PreviewContext.Provider>
    </>
  );
}

export default memo(SearchBar);
