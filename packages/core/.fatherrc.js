export default {
  entry:'src/index.ts',
  esm:{
    type:'babel',
    importLibToEs: true
  },
  cjs:'babel'
}
