module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    },
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}
