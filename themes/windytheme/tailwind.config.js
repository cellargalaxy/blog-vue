/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['content/**/*.md', 'layouts/**/*.html'],
  theme: {
    extend: {
      height: {
        '1/2-screen': '50vh',
      },
      width: {
        'main': '48rem',
      },
      maxWidth: {
        'main': '48rem',
      },
      minHeight: {
        '1/2-screen': '50vh',
      },
      maxHeight: {
        '1/2-screen': '50vh',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

