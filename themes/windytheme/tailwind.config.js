/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['content/**/*.md', 'layouts/**/*.html'],
  theme: {
    extend: {
      height: {
        '1/2-screen': '50vh',
        '3/10-screen': '30vh',
        '7/10-screen': '70vh',
      },
      width: {
        'main': '48rem',
      },
      maxWidth: {
        'main': '48rem',
      },
      minHeight: {
        '1/2-screen': '50vh',
        '7/10-screen': '70vh',
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

