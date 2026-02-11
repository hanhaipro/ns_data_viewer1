/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
      minWidth: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
      maxWidth: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
      minHeight: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
      maxHeight: Object.fromEntries([...Array(2000)].map((_, i) => [i, `${i / 4}rem`])),
      fontSize: Object.fromEntries([...Array(200)].map((_, i) => [i, `${i / 4}rem`])),
      lineHeight: Object.fromEntries([...Array(200)].map((_, i) => [i, `${i / 4}rem`])),
      borderRadius: Object.fromEntries([...Array(40)].map((_, i) => [i, `${i / 4}rem`])),
      borderWidth: Object.fromEntries([...Array(40)].map((_, i) => [i, `${i / 4}rem`])),
      letterSpacing: Object.fromEntries([...Array(10)].map((_, i) => [i, `${i / 4}rem`])),
      gridTemplateColumns: Object.fromEntries([...Array(100)].map((_, i) => [i, `repeat(${i}, minmax(0, 1fr))`])),
      gridTemplateRows: Object.fromEntries([...Array(100)].map((_, i) => [i, `repeat(${i}, minmax(0, 1fr))`])),
      gridColumn: Object.fromEntries([...Array(100)].map((_, i) => [`span-${i}`, `span ${i} / span ${i}`])),
      gridColumnStart: Object.fromEntries([...Array(101)].map((_, i) => [`${i}`, `${i}`])),
      gridColumnEnd: Object.fromEntries([...Array(101)].map((_, i) => [`${i}`, `${i}`])),
    },
  },
  plugins: [],
};
