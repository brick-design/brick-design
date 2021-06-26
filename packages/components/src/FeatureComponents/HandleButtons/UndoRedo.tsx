import React, { memo, useCallback } from 'react';
import { useSelector,undo,redo } from '@brickd/canvas';
import {isEqual} from 'lodash';
import styles from './index.less';
import Icon from '../../Components/Icon';
import { redoIcon, undoIcon } from '../../assets';

interface UndoRedoProps{
	isUndo?:boolean
}

function UndoRedo(props:UndoRedoProps){
	const {isUndo}=props;
const {undo:undoData,redo:redoData}=	useSelector(['undo','redo'],(prevState,nextState)=>{
	const {undo,redo}=nextState;
	if(isUndo){
		return !isEqual(undo,prevState.undo);
	}
	return !isEqual(redo,prevState.redo);
});
const isAble=isUndo?!!undoData.length:!!redoData.length;
	const onClick=useCallback((event:React.MouseEvent)=>{
		event.stopPropagation();
		if(isAble){
			isUndo?undo():redo();
		}
	},[isAble]);

	return <Icon className={styles['icon-container']}
							 iconClass={styles['icon-class']}
							 icon={isUndo?undoIcon:redoIcon}
							 onClick={onClick}
	/>;
}

export default memo(UndoRedo);
