import { IConfig } from 'umi-types';

const path=require('path')
const config: IConfig = {
  chainWebpack(config, { webpack }) {
    // 设置 alias
    config.resolve.alias.set('@', path.resolve(__dirname, 'src'));
    config.optimization.splitChunks({
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom|lodash|dva|prop-types|rc-animate|re-resizable|react-dnd|react-dnd-html5-backend|sortablejs|highlight.js)[\\/]/,
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
        chunks: ['vendors','antdesigns', 'umi']
      },
    ],

  ]
}

export default config;
