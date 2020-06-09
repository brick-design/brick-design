export default {
  entry: 'src/index.ts',
  esm: {
    type: 'rollup',
    file: 'index',
    importLibToEs: true,
  },
};
