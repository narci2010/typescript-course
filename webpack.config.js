const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  mode: 'production',
  devServer: {
    contentBase: path.join(__dirname, '/'),
    compress: true,
    port: 9000
  },
  node: {
    fs: 'empty'
  },
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: [ 'style-loader', 'css-loader' ]
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    // 这样就可以import ts模块了
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, './tsconfig.json')
      })
    ]
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '拓胜科技TypeScript深度课程',
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联css
      },
      filename: 'index.html',
      // template: 'index.html'
      template: 'index.spreadjs.html'
    }),
    new webpack.LoaderOptionsPlugin({
      // test: /\.xxx$/, // may apply this only for some modules
      options: {
        alias: {
          // '@': path.resolve(__dirname, 'src/'),
          '~': path.resolve(__dirname, 'node_modules/')
        }
      }
    })
  ]
}
