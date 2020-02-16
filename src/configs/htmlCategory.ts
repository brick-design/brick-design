import { CategoryType } from '@/types/CategoryType';

export const htmlContainers:CategoryType = {
  'HTMLTag': {
    span: 24,
    components: {
      'div': {},
      'a': {},
      'span': {},
    },
  },
};


export const htmlNonContainers:CategoryType = {
  'HTMLTag': {
    span: 24,
    components: {
      'img': {}
    },
  },
};
