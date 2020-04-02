const path=require('path')
import { IConfig } from 'umi-types';

const config:IConfig={
  chainWebpack(config, { webpack }) {
    // 设置 alias
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
  },
  publicPath:'./',
  plugins: [
    [
      'umi-plugin-block-dev',
      {},
    ],
    [
      'umi-plugin-react',
      {
        dva: true,
        antd: true,
        locale: true,
      },
    ],

  ]
}

export default config;
