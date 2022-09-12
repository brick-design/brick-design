import React, { memo, useRef, useState } from 'react';
import { useForceRender } from '@brickd/hooks';
import styles from './index.less';
import SortableTags from '../../Components/SortableTags';

interface StringArrayProps {
  onChange?: (v: string[]) => void;
  value?: string[];
  isNumber?: boolean;
}

function CommonArray(props: StringArrayProps) {
  const { value = [], onChange, isNumber } = props;
  const forceRender = useForceRender();
  const [inputValue, setInputValue] = useState<string>();
  const isFocusRef = useRef(false);
  const inputContainerRef = useRef<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>();
  const change = (event: any) => {
    const value = event.target.value;
    if (isNumber && !/\d+/.test(value)) {
      return setInputValue('');
    }
    setInputValue(value);
    inputContainerRef.current.style.width = value.length * 7 + 'px';
  };

  const onSortChange = (newSortData: any[]) => {
    onChange && onChange(newSortData);
  };
  const onFocus = () => {
    isFocusRef.current = true;
    forceRender();
  };

  const onBlur = () => {
    isFocusRef.current = false;
    setInputValue('');
    value.length > 0 && (inputContainerRef.current.style.display = 'none');
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
    const { key } = event;
    if (key === 'Enter') {
      if (inputValue && !value.includes(inputValue)) {
        value.push(inputValue);
        onChange && onChange(value);
        setInputValue('');
      }
    } else if (key === 'Backspace') {
      if (!inputValue) {
        value.pop();
        onChange && onChange(value);
      }
    }
  };
  const onContainerFocus = () => {
    inputContainerRef.current.style.display = 'flex';
    inputRef.current.focus();
  };

  return (
    <SortableTags
      sortData={value}
      onClick={onContainerFocus}
      onSortChange={onSortChange}
      className={`${styles['sort-tags']} ${
        isFocusRef.current && styles['focus-class']
      }`}
      extra={
        <div
          ref={inputContainerRef}
          draggable={false}
          id={'extra-item'}
          className={styles['extra']}
          style={{ width: 5 }}
        >
          <input
            ref={inputRef}
            className={styles['common-input']}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={change}
            onKeyDown={onKeyDown}
            value={inputValue}
          />
        </div>
      }
    />
  );
}

export default memo(CommonArray);
