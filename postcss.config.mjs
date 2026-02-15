/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Perhatikan: ada tanda @ dan /postcss
    autoprefixer: {},
  },
};

export default config;
