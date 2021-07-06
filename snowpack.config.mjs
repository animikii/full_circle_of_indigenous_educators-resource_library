export default {
  mount: {
    src: "/",
  },
  plugins: [
    '@snowpack/plugin-vue',
  ],
  buildOptions: {
    sourcemaps: true
  },
  optimize: {
    bundle: true,
    minify: true,
    target: 'es2018'
  }

};
