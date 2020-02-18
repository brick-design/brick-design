import { CategoryType } from '@/types/CategoryType';

export const htmlContainers:CategoryType = {
  'HTMLTag': {
    span: 24,
    components: {
      'div': null,
      'a': null,
      'span': null,
    },
  },
};


export const htmlNonContainers:CategoryType = {
  'HTMLTag': {
    components: {
      'img': {
        props:[{
          src:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1581925168337&di=75a5be185435bcb75d5d65bdbabe431b&imgtype=0&src=http%3A%2F%2Fimg.kutoo8.com%2Fupload%2Fimage%2F43278246%2Fleisineiyi%2520%25287%2529_960x540.jpg',
        }]
      }
    },
  },
};
