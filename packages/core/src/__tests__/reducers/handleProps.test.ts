import { reducer } from '../../reducers';
import { legoState } from '../../reducers/handlePageBrickdState';
import ACTION_TYPES from '../../actions/actionTypes';
import config from '../configs';

import { PageConfigType, StateType } from '../../types';
import { ChangePropsPayload } from '../../actions';
import { ROOT, setBrickdConfig, setPageName } from '../../utils';

beforeAll(() => {
  setBrickdConfig(config);
  setPageName('initPage');
  console.warn = jest.fn();
});

afterAll(() => {
  setBrickdConfig(null);
  setPageName(null);
});

describe('changeProps', () => {
  const action = { type: ACTION_TYPES.changeProps };
  it('selectedInfo===null', () => {
    expect(reducer({ initPage: legoState }, action)).toEqual({
      initPage: legoState,
    });
  });
  it('changeProps and style===undefined', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'img', props: { a: 1 } },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [ROOT],
        parentKey: '',
        propsConfig: {},
      },
    };
    const payload: ChangePropsPayload = { props: { b: 2 } };
    const state = reducer({ initPage: prevState }, { ...action, payload });
    const expectState: StateType = {
      ...prevState,
      undo: [{ pageConfig }],
      pageConfig: {
        [ROOT]: { componentName: 'img', props: { b: 2 } },
      },
    };

    expect(state).toEqual({ initPage: expectState });
  });
  it('changeProps and style', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'img', props: { style: { a: 1 } } },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [ROOT],
        parentKey: '',
        propsConfig: {},
      },
    };
    const payload: ChangePropsPayload = { props: { b: 2 } };
    const state = reducer({ initPage: prevState }, { ...action, payload });
    const expectState: StateType = {
      ...prevState,
      undo: [{ pageConfig }],
      pageConfig: {
        [ROOT]: { componentName: 'img', props: { b: 2, style: { a: 1 } } },
      },
    };

    expect(state).toEqual({ initPage: expectState });
  });
});

describe('resetProps', () => {
  const action = { type: ACTION_TYPES.resetProps };
  it('selectedInfo===null', () => {
    expect(reducer({ initPage: legoState }, action)).toEqual({
      initPage: legoState,
    });
  });
  it('selectedInfo!==null and style===undefined', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'img', props: { a: 3 } },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [],
        parentKey: '',
        propsConfig: {},
        props: { b: 2 },
      },
    };
    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...prevState,
      undo: [{ pageConfig }],
      pageConfig: {
        [ROOT]: { componentName: 'img', props: { b: 2 } },
      },
    };
    expect(state).toEqual({ initPage: expectState });
  });
  it('selectedInfo!==null and style!==undefined', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'img', props: { a: 1, style: { c: 3 } } },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [],
        parentKey: '',
        propsConfig: {},
        props: { b: 2 },
      },
    };
    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...prevState,
      undo: [{ pageConfig }],
      pageConfig: {
        [ROOT]: { componentName: 'img', props: { b: 2, style: { c: 3 } } },
      },
    };
    expect(state).toEqual({ initPage: expectState });
  });
});
