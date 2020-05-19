export default {
  entry:'src/index.tsx',
  esm:{
    type:'babel',
    importLibToEs: true
  },
  cjs:'babel',
  cssModules:true,
}
