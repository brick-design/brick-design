import React, {
  useState,
  memo,
  useImperativeHandle,
  forwardRef,
  useRef,
useEffect,
} from 'react';
import { useForceRender } from '@brickd/hooks';
import styles from './index.less';

export interface TextareaProps extends React.TextareaHTMLAttributes<any> {
  inputClass?: string;
  focusClass?: string;
}
function Textarea(props: TextareaProps, ref: any) {
  const {
    onChange,
    className,
    focusClass,
    defaultValue,
    inputClass,
    value:v,
    ...rest
  } = props;
  const [value, setValue] = useState(v||defaultValue);
  const forceRender = useForceRender();
  const isFocusRef = useRef(false);
  const targetRef=useRef<HTMLTextAreaElement>();
  useImperativeHandle(
    ref,
    () => ({
      setValue,
    }),
    [setValue],
  );

  useEffect(()=>{
    if(value===undefined){
      setValue(v);
    }
    targetRef.current.style.height=targetRef.current.scrollHeight+'px';
  },[v,value,setValue]);

  const change = (event: any) => {
    const target=event.target;
    const value = target.value;
    target.style.height='auto';
    target.style.height=target.scrollHeight+'px';
    setValue(value);
    onChange && onChange(value);
  };

  const onFocus = () => {
    isFocusRef.current = true;
    forceRender();
  };

  const onBlur = () => {
    isFocusRef.current = false;
    setTimeout(forceRender,200);
  };
  return (
    <div
      className={`${styles['container']} ${className} ${
        isFocusRef.current && focusClass
      }`}
    >
      <textarea
        className={`${styles['common-input']} ${inputClass}`}
        ref={targetRef}
        onBlur={onBlur}
        onFocus={onFocus}
        rows={1}
        {...rest}
        onChange={change}
        value={value}
      />
    </div>
  );
}

export default memo(forwardRef(Textarea));
