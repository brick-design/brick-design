import { useEffect, useRef, useContext } from 'react';
import { ApiType, fetchData, FetcherType } from '@brickd/utils';
import { StaticContext } from '../components/StaticContext';

const getFetchData = async (
  prevApi: ApiType | undefined,
  nextApi: ApiType | undefined,
  prevData: any,
  nextData: any,
  isFirst?: boolean,
  options?: object,
  fetcher?: FetcherType,
) => {
  if (!nextApi) return;
  const result = await fetchData(
    fetcher,
    prevApi,
    nextApi,
    prevData,
    nextData,
    isFirst,
    options,
  );
  const { state, pageState } = (result || {}) as {
    state?: any;
    pageState?: any;
  };
  if (state) {
    nextData.setState(state);
  }
  if (pageState) {
    nextData.setPageState(pageState);
  }
};
export function useService(state: any, api?: ApiType) {
  const { options } = useContext(StaticContext);
  const prevState = useRef(state);
  const prevApi = useRef(api);
  useEffect(() => {
    getFetchData(undefined, api, undefined, state, true, options);
  }, []);

  useEffect(() => {
    if (prevState.current) {
      getFetchData(
        prevApi.current,
        api,
        prevState.current,
        state,
        false,
        options,
      );
    }
  }, [prevApi, api, prevState, state]);
}
