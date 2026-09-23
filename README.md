# Veda Booti Premium E-commerce

Premium dark-green + gold Ayurvedic e-commerce frontend built with React + Vite.

## Start
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Important
- Font: Montserrat for all body text; paragraphs are 15px.
- No `data.js` / central product data file is used. Page data is kept in the page/component where it is needed.
- Each page has its own dedicated JSX + CSS file.
- Social icons use `react-icons`.
- `src/lib/api.js` is included for future backend/API integration.
- Uploaded Veda Booti logo and supplied visual references are stored in `public/assets`.
- Cart/wishlist demo state uses localStorage so the frontend works without a backend.
- The admin area has dedicated pages for Dashboard, Categories, Products, Orders, Support and Home Hero.
- The mobile navigation, product grid, hero, checkout and admin sidebar are responsive.
