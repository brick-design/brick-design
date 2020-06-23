export default {
  entry: 'src/index.tsx',
  esm: {
    type: 'rollup',
    file: 'index',
    importLibToEs: true,
  },
  lessInRollupMode: {},
  extractCSS: true,
  // cjs:'babel',
  cssModules: true,
  // lessInBabelMode:true
};
