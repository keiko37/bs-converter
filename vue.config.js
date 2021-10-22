module.exports = {
  publicPath:
    process.env.NODE_ENV === 'production' ? '/bs-converter/' : '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/scss/styles.scss";',
      },
    },
  },
};
