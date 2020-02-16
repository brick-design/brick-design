import { CategoryType } from '@/types/CategoryType';

export const reactContainers:CategoryType = {
  'Layout': {
    components: {
      'Layout': {},
      'Layout.Footer': {},
      'Layout.Content': {},
      'Layout.Header': {},
      'Layout.Sider': {},
    },
  },
  'GridLayout': {
    components: {
      'Row': {},
      'Col': {},
    },

  },
  'Tabs': {
    span: 12,
    components: {
      'Tabs': {},
      'Tabs.TabPane': {},
    },
  },
  'Cards': {
    span: 12,
    components: {
      'Card': {},
      'Card.Grid': {},
      'Card.Meta': {},
    },

  },
  'Collapse': {
    span: 12,
    components: {
      'Collapse': {},
      'Collapse.Panel': {},
    },

  },
  'Timeline': {
    span: 12,
    components: {
      Timeline: {},
      'Timeline.Item': {},
    },
  },
  'Breadcrumb': {
    span: 12,
    components: {
      Breadcrumb: {},
      'Breadcrumb.Item': {},
      'Breadcrumb.Separator': {},
    },
  },
  'Dropdown': {
    span: 12,
    components: {
      Dropdown: {},
      'Dropdown.Button': {},
    },
  },
  'Menus': {
    span: 12,
    components: {
      'Menu': {},
      'Menu.Item': {},
      'Menu.SubMenu': {},
      'Menu.ItemGroup': {},
      'Menu.Divider': {},
    },
  },
  'Steps': {
    span: 12,
    components: {
      'Steps': {},
      'Steps.Step': {},
    },
  },
  'AutoComplete': {
    span: 12,
    components: {
      'AutoComplete': {},
      'AutoComplete.Option': {},
      'AutoComplete.OptGroup': {},
    },
  },
  'DatePicker': {
    components: {
      'DatePicker': {},
      'DatePicker.MonthPicker': {},
      'DatePicker.WeekPicker': {},
      'DatePicker.RangePicker': {},
    },
  },
  'Form': {
    components: {
      'Form': {},
      'Form.Item': {},
    },
  },
  'Button': {
    span: 12,
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
      Mentions: {},
      'Mentions.Option': {},
    },
  },
  'Select': {
    span: 12,
    components: {
      'Select': {},
      'Select.Option': {},
      'Select.OptGroup': {},
    },

  },

  'TreeSelect': {
    components: {
      'TreeSelect': {},
      'TreeSelect.TreeNode': {},
    },
  },
  'List': {
    components: {
      List: {},
      'List.Item': {},
      'List.Item.Meta': {},
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
      'Anchor': {},
      'Anchor.Link': {},
    },
  },
  'Input': {
    components: {
      'Input': {},
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
      Radio: {children:'Radio'},
      'Radio.Button': {children:'Radio.Button'},
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
