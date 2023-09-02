import { useEffect, useState } from 'react';
import { EditorState, StateEffect } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { EditorView, keymap, ViewUpdate, placeholder } from '@codemirror/view';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { oneDark } from '@codemirror/theme-one-dark';
import { getStatistics } from './utils';
import { ReactCodeMirrorProps } from './CodeMirror';

export interface UseCodeMirror extends ReactCodeMirrorProps {
  container?: HTMLDivElement | null;
}

export function useCodeMirror(props: UseCodeMirror) {
  const {
    value,
    selection,
    onChange,
    onStatistics,
    onCreateEditor,
    onUpdate,
    extensions = [],
    autoFocus,
    theme = 'dark',
    height = '',
    minHeight = '',
    maxHeight = '',
    placeholder: placeholderStr = '',
    width = '',
    minWidth = '',
    maxWidth = '',
    editable = true,
    readOnly = false,
    indentWithTab: defaultIndentWithTab = true,
    basicSetup: defaultBasicSetup = true,
    root,
    initialState,
  } = props;
  const [container, setContainer] = useState<HTMLDivElement>();
  const [view, setView] = useState<EditorView>();
  const [state, setState] = useState<EditorState>();
  const defaultLightThemeOption = EditorView.theme(
    {
      '&': {
        backgroundColor: '#fff',
      },
    },
    {
      dark: false,
    },
  );
  const defaultThemeOption = EditorView.theme({
    '&': {
      height,
      minHeight,
      maxHeight,
      width,
      minWidth,
      maxWidth,
    },
  });
  const updateListener = EditorView.updateListener.of((vu: ViewUpdate) => {
    if (vu.docChanged && typeof onChange === 'function') {
      const doc = vu.state.doc;
      const value = doc.toString();
      onChange(value, vu);
    }
    onStatistics && onStatistics(getStatistics(vu));
  });

  let getExtensions = [updateListener, defaultThemeOption];
  if (defaultIndentWithTab) {
    getExtensions.unshift(keymap.of([indentWithTab]));
  }
  if (defaultBasicSetup) {
    if (typeof defaultBasicSetup === 'boolean') {
      getExtensions.unshift(basicSetup());
    } else {
      getExtensions.unshift(basicSetup(defaultBasicSetup));
    }
  }

  if (placeholderStr) {
    getExtensions.unshift(placeholder(placeholderStr));
  }

  switch (theme) {
    case 'light':
      getExtensions.push(defaultLightThemeOption);
      break;
    case 'dark':
      getExtensions.push(oneDark);
      break;
    default:
      getExtensions.push(theme);
      break;
  }

  if (editable === false) {
    getExtensions.push(EditorView.editable.of(false));
  }
  if (readOnly) {
    getExtensions.push(EditorState.readOnly.of(true));
  }

  if (onUpdate && typeof onUpdate === 'function') {
    getExtensions.push(EditorView.updateListener.of(onUpdate));
  }
  getExtensions = getExtensions.concat(extensions);

  useEffect(() => {
    if (container && !state) {
      const config = {
        doc: value,
        selection,
        extensions: getExtensions,
      };
      const stateCurrent = initialState
        ? EditorState.fromJSON(initialState.json, config, initialState.fields)
        : EditorState.create(config);
      setState(stateCurrent);
      if (!view) {
        const viewCurrent = new EditorView({
          state: stateCurrent,
          parent: container,
          root,
        });
        setView(viewCurrent);
        onCreateEditor && onCreateEditor(viewCurrent, stateCurrent);
      }
    }
    return () => {
      if (view) {
        setState(undefined);
        setView(undefined);
      }
    };
  }, [container, state]);

  useEffect(() => setContainer(props.container!), [props.container]);

  useEffect(
    () => () => {
      if (view) {
        view.destroy();
        setView(undefined);
      }
    },
    [view],
  );

  useEffect(() => {
    if (autoFocus && view) {
      view.focus();
    }
  }, [autoFocus, view]);

  useEffect(() => {
    if (view) {
      view.dispatch({ effects: StateEffect.reconfigure.of(getExtensions) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    theme,
    extensions,
    height,
    minHeight,
    maxHeight,
    width,
    minWidth,
    maxWidth,
    placeholderStr,
    editable,
    readOnly,
    defaultIndentWithTab,
    defaultBasicSetup,
    onChange,
    onUpdate,
  ]);

  useEffect(() => {
    const currentValue = view ? view.state.doc.toString() : '';
    if (view && value !== currentValue) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value || '' },
      });
    }
  }, [value, view]);

  return { state, setState, view, setView, container, setContainer };
}
