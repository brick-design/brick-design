import { CategoryType } from '@/types/CategoryType';

export const reactContainers:CategoryType = {
  'Layout': {
    components: {
      'Layout': null,
      'Layout.Footer': null,
      'Layout.Content': null,
      'Layout.Header': null,
      'Layout.Sider': null,
    },
  },
  'GridLayout': {
    components: {
      'Row': null,
      'Col': null,
    },

  },
  'Tabs': {
    components: {
      'Tabs': null,
      'Tabs.TabPane': null,
    },
  },
  'Cards': {
    components: {
      'Card': null,
      'Card.Grid': null,
      'Card.Meta': null,
    },

  },
  'Collapse': {
    components: {
      'Collapse': null,
      'Collapse.Panel': null,
    },

  },
  'Timeline': {
    components: {
      Timeline: null,
      'Timeline.Item': null,
    },
  },
  'Breadcrumb': {
    components: {
      Breadcrumb: null,
      'Breadcrumb.Item': null,
      'Breadcrumb.Separator': null,
    },
  },
  'Dropdown': {
    components: {
      Dropdown: null,
      'Dropdown.Button': null,
    },
  },
  'Menus': {
    span: 12,
    components: {
      'Menu': null,
      'Menu.Item': null,
      'Menu.SubMenu': null,
      'Menu.ItemGroup': null,
      'Menu.Divider': null,
    },
  },
  'Steps': {
    span: 12,
    components: {
      'Steps': null,
      'Steps.Step': null,
    },
  },
  'AutoComplete': {
    span: 12,
    components: {
      'AutoComplete': null,
      'AutoComplete.Option': null,
      'AutoComplete.OptGroup': null,
    },
  },
  'DatePicker': {
    components: {
      'DatePicker': null,
      'DatePicker.MonthPicker': null,
      'DatePicker.WeekPicker': null,
      'DatePicker.RangePicker': null,
    },
  },
  'Form': {
    components: {
      'Form': null,
      'Form.Item': null,
    },
  },
  'Button': {
    props: [{
      type: 'primary',
      children: 'primary',
    }, {
      type: 'danger',
      children: 'danger',
    }, {
      type: 'dashed',
      children: 'dashed',
    }, {
      type: 'primary',
      icon: 'search',
      children: 'srch',
    }, {
      type: 'primary',
      loading: true,
      children: 'load',
    }],
  },
  'Mentions': {
    components: {
      Mentions:null,
      'Mentions.Option': null,
    },
  },
  'Select': {
    components: {
      'Select': null,
      'Select.Option': null,
      'Select.OptGroup': null,
    },

  },

  'TreeSelect': {
    components: {
      'TreeSelect': null,
      'TreeSelect.TreeNode': null,
    },
  },
  'List': {
    components: {
      List: null,
      'List.Item': null,
      'List.Item.Meta':null,
    },
  },
  'Tag': {
    props: [],
  },
  'Cascader': {
    props: [],
  },
  'PageHeader': {
    props: [],
  },
  Pagination: {
    props: [],
  },
  'Tooltip': {
    props: [],
  },
  'Spin': {
    props: [],
  },
  'Popover': {
    props: [],
  },
  'Divider': {
    props: [],
  },
  'Carousel': {
    props: [],
  },
  'Badge': {
    props: [],
  },
  'BackTop': {
    props: [],
  },
  'Anchor': {
    components: {
      'Anchor': null,
      'Anchor.Link': null,
    },
  },
  'Input': {
    components: {
      'Input': {
        props:[{}]
      },
      'Input.Group': {},
    },
  },
  'Upload': {
    props: [],
  },

  'TipsBox': {
    props: [],
  },
  'Radio': {
    components: {
      'Radio.Group': {},
    },
  },
  Switch: {
    props: [],
  },
  'Affix': {},
  'Modal': {
    props: [],
  },
  'Drawer': {
    props: [],
  },

};

export const reactNonContainers:CategoryType = {
  Typography: {
    components: {
      'Typography.Text': {},
      'Typography.Title': {},
      'Typography.Paragraph': {},
    },
  },
  Icon: {
    props: [{type:"heart"}],
  },
  Checkbox: {
    components: {
      Checkbox: {},
      'Checkbox.Group': {},

    },
  },
  InputNumber: {
    props: [],
  },
  Input: {
    components: {
      'Input.TextArea': {},
      'Input.Search': {},
    },

  },
  Radio: {
    components: {
      Radio: {
        props:[{children:'Radio'}]
      },
      'Radio.Button': {
        props:[{children:'Radio.Button'}]
      },
    },
  },
  Rate: {
    props: [],
  },
  Slider: {
    props: [],
  },
  Avatar:{
    props:[]
  },
  Transfer:{
    props:[]
  },

};
