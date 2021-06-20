import React, { memo, useState, useCallback, useRef, useEffect } from 'react'
import styles from './index.less';
import Icon from "../../../Components/Icon";
import { addIcon, arrowIcon, rightIcon, deleteIcon1, copyIcon,  } from '../../../assets'
import Resizeable, {ResizeableRefType} from "../../../Components/Resizeable";
import { createLayers, getStore, changeLayer, useSelector, copyLayers } from '@brickd/react'
import {map,isEqual,keys} from 'lodash'



interface LayerProp{
    layerName:string
    layers:string[]
  onDelete:(layerName:string)=>void
}

const LayerItem=memo(function(props:LayerProp){
    const {layerName,onDelete}=props
  const [isEdit,setIsEdit]=useState(false)
  const nameDivRef=useRef<HTMLDivElement>();
   const {layerName:selectLayerName}=useSelector(['layerName'],undefined,undefined,true)
    // const renameLayer=()=>{
    //
    // }
    const changeLayerName=useCallback(()=>{
      if(selectLayerName!==layerName)
        changeLayer({layerName})
    },[selectLayerName])
  const changeEdit=useCallback((event:any)=>{
    event.stopPropagation();
    setIsEdit(!isEdit)
    setTimeout(()=>{
      if(!isEdit){
        nameDivRef.current.focus()
      }
    },200)
  },[isEdit,setIsEdit])

  const copyPage=(e:React.MouseEvent)=>{
     e.stopPropagation()
    copyLayers({layerName})
  }

  const deletePage=(e:React.MouseEvent)=>{
    e.stopPropagation()
    onDelete(layerName)
  }
    const isSelected=selectLayerName===layerName

    return <div  onClick={changeLayerName} className={styles['layer-item']} >
       <img style={{visibility:isSelected?'visible':'hidden'}} src={rightIcon} className={styles['right-icon']}/>
        <div ref={nameDivRef} onBlur={changeEdit} onDoubleClick={changeEdit} contentEditable={isEdit} style={{fontWeight:isSelected?500:400}} className={styles['layer-text']} >{layerName}</div>
      <Icon onClick={copyPage}  icon={copyIcon} iconClass={styles['icon-size']} className={styles['hover-icon']}/>
      <Icon onClick={deletePage} icon={deleteIcon1} iconClass={styles['icon-size']} className={styles['hover-icon']}/>
    </div>
})

interface PageProps{
  onDelete:(layerName:string)=>void

}

function Pages(props:PageProps){
  const {onDelete}= props
  const [isFold,setIsFold]=useState(false);
    const brickdStore=useRef(getStore()).current;
  const {layerName}=useSelector(['layerName'],undefined,undefined,true)
  const [layers,setLayers]=useState<string[]>([])

    const resizeRef=useRef<ResizeableRefType>();
    useEffect(()=>{
        const layers= keys(brickdStore.getState())
        layers.shift();
        setLayers(layers)
    },[])

    useEffect(()=>{
        function checkForUpdates(){
           const newLayers=keys(brickdStore.getState())
            newLayers.shift();
            if(!isEqual(newLayers,layers)){
                setLayers(newLayers)
            }
        }
      const unsubscribe= brickdStore.subscribe(checkForUpdates);
      return unsubscribe
    },[layers,setLayers])
    const changeFold=useCallback(()=>{

        if(!isFold){
            resizeRef.current.changeFold({heightTarget:40});
        }else {
            resizeRef.current.changeFold({isHeight:true});
        }
        setIsFold(!isFold);
    },[isFold,setIsFold]);

    const createPage=()=>{
            createLayers({layerName:'Layer'+layers.length})
    }



    return <Resizeable
        ref={resizeRef}
        minHeight={40}
        defaultHeight={100}
        bottom
        className={styles['page-container']}
    >
        <div className={styles['header-container']}>
            <span className={styles['header-name']}>{layerName}</span>
            <div className={styles['header-right']}>
                <span style={{marginRight:10}}>{`${layers.indexOf(layerName)+1}/${layers.length}`}</span>
                <Icon onClick={createPage} icon={addIcon} className={styles['add-icon']}/>
                <Icon onClick={changeFold} icon={arrowIcon} className={`${styles['add-icon']} ${!isFold&&styles['rotate180']}`}/>
            </div>
        </div>
        <div className={styles['page-content']}>
            {map(layers,(v)=><LayerItem  onDelete={onDelete} layers={layers} layerName={v} key={v}/>)}
        </div>

    </Resizeable>;
}

export default memo(Pages);
