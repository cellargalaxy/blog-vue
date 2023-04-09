module.exports = {
    theme: {
        extend: {
            height: {
                '1/2-screen': '50vh',
            },
            width: {
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
};