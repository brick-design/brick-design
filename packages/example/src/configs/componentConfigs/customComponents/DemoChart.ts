import { PROPS_TYPES } from '@/types/ConfigTypes';
import { ComponentConfigType } from '@/types/ComponentConfigType';

// 数据源
const data = [
  { genre: 'Sports', sold: 275, income: 2300 },
  { genre: 'Strategy', sold: 115, income: 667 },
  { genre: 'Action', sold: 120, income: 982 },
  { genre: 'Shooter', sold: 350, income: 5271 },
  { genre: 'Other', sold: 150, income: 3710 }
];


const DemoChart: ComponentConfigType = {
  propsConfig: {
    data: {
      label: 'data',
      type: [PROPS_TYPES.objectArray,PROPS_TYPES.json],
      childPropsConfig:[{
        genre:{
          label:'genre',
          type:PROPS_TYPES.string
        },
        sold:{
          label:'sold',
          type:PROPS_TYPES.number
        },
        income:{
          label:'income',
          type:PROPS_TYPES.number
        }
      }]
    },
    width:{
      label:'宽度',
      type:PROPS_TYPES.number
    },
    height:{
      label:'高度',
      type:PROPS_TYPES.number
    }
  },
};

export default DemoChart;
