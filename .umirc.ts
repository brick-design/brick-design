const path=require('path')
import { IConfig } from 'umi-types';

const config:IConfig={
  chainWebpack(config, { webpack }) {
    // 设置 alias
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
    config.optimization.splitChunks({
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|lodash|dva|prop-types|rc-animate|re-resizable|sortablejs|highlight.js)[\\/]/,
          priority: -10,
        },
        antdesigns: {
          name: 'antdesigns',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
          priority: -11,
        }
      },
    });
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
        chunks: ['vendors','antdesigns', 'umi']
      },
    ],

  ]
}

export default config;
