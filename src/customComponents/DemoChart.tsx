import React from 'react';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';



// 定义度量
const cols = {
  sold: { alias: '销售量' },
  genre: { alias: '游戏种类' }
};

// 渲染图表
function DemoChart(props:any) {
  const {data=[],width=600,height=400}=props
  return (
    <Chart width={width} height={height} data={data} scale={cols}>
      <Axis name="genre" title/>
      <Axis name="sold" title/>
      <Legend position="top" />
      <Tooltip />
      <Geom type="interval" position="genre*sold" color="genre" />
    </Chart>)
}

export default DemoChart
