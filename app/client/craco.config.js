const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const {
  CracoAliasPlugin,
  configPaths,
} = require('react-app-rewire-alias/lib/aliasDangerous')
const { loaderByName, getLoader } = require('@craco/craco')

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Enable project references
      const { match: babelLoader } = getLoader(
        webpackConfig,
        loaderByName('babel-loader'),
      )
      babelLoader.use = [
        {
          loader: babelLoader.loader,
          options: babelLoader.options,
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            transpileOnly: true,
            projectReferences: true,
          },
        },
      ]

      delete babelLoader.loader
      delete babelLoader.options

      return webpackConfig
    },
  },
  babel: {
    plugins: ['macros'],
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}))
          return webpackConfig
        },
      },
    },
    {
      plugin: CracoAliasPlugin,
      options: { alias: configPaths('./tsconfig.paths.json') },
    },
  ],
}
