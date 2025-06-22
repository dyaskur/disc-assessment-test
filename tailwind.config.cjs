module.exports = {
  content: ['./src/routes/**/*.{svelte,js,ts}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        saung: {
          'base-100': '#f1f1e6',
          'base-content': '#000000',
          primary: '#3b82f6',
          secondary: '#facc15',
          accent: '#37cdbe',
          neutral: '#3d4451'
        }
      }
    ]
  },
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem'
      }
    }
  }
};
