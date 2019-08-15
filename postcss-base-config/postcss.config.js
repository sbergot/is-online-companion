module.exports = {
    plugins: [
        require('postcss-import'),
        require('tailwindcss'),
        require('cssnano')({
            preset: 'default',
        }),
    ]
}
