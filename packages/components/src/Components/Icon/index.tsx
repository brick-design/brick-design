import React, {
  forwardRef,
  memo,
  Ref,
  useImperativeHandle,
  useRef,
} from 'react';
import styles from './index.less';

export interface IconProps extends React.AllHTMLAttributes<any> {
  icon?: string;
  iconClass?: string;
}
function Icon(props: IconProps, ref: Ref<HTMLDivElement>) {
  const { icon, iconClass, className, ...rest } = props;
  const divRef = useRef<HTMLDivElement>();
  useImperativeHandle(ref, () => divRef.current, []);
  return (
    <div
      ref={divRef}
      className={`${styles['container']} ${className}`}
      {...rest}
    >
      <img draggable={false} className={iconClass} src={icon} />
    </div>
  );
}
export default memo(forwardRef(Icon));
