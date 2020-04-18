const HtmlWebPackPlugin = require("html-webpack-plugin");
module.exports = {
  devtool : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot|png|jpe?g|gif)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
           /*  options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            } */
          }
        ]
      },
      {
        test: /\.svg/,
        use: {
            loader: 'svg-url-loader',
            options: {}
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
};