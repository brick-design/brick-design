import {renderHook,act} from "@testing-library/react-hooks";
import {useSelector} from '../../hooks/useSelector';
import { LegoProvider } from '../../components/LegoProvider';
import config from '../configs';

describe('useSelector',()=>{

  it('测试',()=>{
    act(()=>{LegoProvider({config:config})})
    const hookState=renderHook(()=>useSelector(['hoverKey']))
    expect(hookState).toEqual({hoverKey:null})
  })
})
