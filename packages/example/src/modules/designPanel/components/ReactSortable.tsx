/* eslint consistent-return: 0 */
import React, { Component } from 'react';
import SortableJS from 'sortablejs';

interface storeType {
  nextSibling: any,
  activeComponent:any
}

const store: storeType = {
  nextSibling: null,
  activeComponent: null,
};


class Sortable extends Component<any, any> {

  static defaultProps = {
    options: {},
    tag: 'div',
    style: {},
  };

  sortable: any = null;
  node: any;

  componentDidMount() {
    const options = { ...this.props.options };

    [
      'onChoose',
      'onStart',
      'onEnd',
      'onAdd',
      'onUpdate',
      'onSort',
      'onRemove',
      'onFilter',
      'onMove',
      'onClone',
    ].forEach((name) => {
      const eventHandler = options[name];

      options[name] = (...params: any) => {
        const [evt] = params;

        if (name === 'onChoose') {
          store.nextSibling = evt.item.nextElementSibling;
          store.activeComponent = this;
        } else if ((name === 'onAdd'||name==='onUpdate') && this.props.onChange) {
          const items = this.sortable.toArray();
          const remote = store.activeComponent;
          const referenceNode = (store.nextSibling && store.nextSibling.parentNode !== null) ? store.nextSibling : null;
          evt.from.insertBefore(evt.item, referenceNode);
          if (remote !== this) {
            const remoteOptions = remote.props.options || {};
            if ((typeof remoteOptions.group === 'object') && (remoteOptions.group.pull === 'clone')) {
              // Remove the node with the same data-reactid
              // evt.item.parentNode.removeChild(evt.item);
            }

          }

          this.props.onChange && this.props.onChange(items, evt);
        }

        if (evt.type === 'move') {
          const [evt, originalEvent] = params;
          const canMove = eventHandler ? eventHandler(evt, originalEvent) : true;
          return canMove;
        }

        setTimeout(() => {
          eventHandler && eventHandler(evt);
        }, 0);
      };
    });

    this.sortable = SortableJS.create(this.node, options);
  }

  shouldComponentUpdate(nextProps: any) {
    // If onChange is null, it is an UnControlled component
    // Don't let React re-render it by setting return to false
    if (!nextProps.onChange) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    if (this.sortable) {
      this.sortable.destroy();
      this.sortable = null;
    }
  }

  render() {
    const {
      tag: Component,
      options, // eslint-disable-line
      onChange, // eslint-disable-line
      ...props
    } = this.props;

    return (
      <Component
        {...props}
        ref={(node: any) => {
          this.node = node;
        }}
      />
    );
  }
}

export default Sortable;
