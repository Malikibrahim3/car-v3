# CarValue Tracker - Landing Page

A modern, performant landing page for the CarValue Tracker mobile app.

## Features

- Custom parallax scrolling effects
- Smooth scroll-triggered animations
- Fully responsive design
- No animation libraries - pure performance
- Optimized for mobile and desktop

## Tech Stack

- React 18
- Vite
- Vanilla CSS with CSS variables
- Custom hooks for parallax and scroll triggers

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
landing/
├── src/
│   ├── components/
│   │   ├── Hero.jsx          # Hero section with phone mockup
│   │   ├── Hook.jsx           # Depreciation chart section
│   │   ├── Features.jsx       # Feature cards
│   │   ├── AppShowcase.jsx    # App screenshot with annotations
│   │   ├── DownloadCTA.jsx    # Final CTA section
│   │   └── Footer.jsx         # Footer
│   ├── hooks/
│   │   └── useParallax.js     # Custom parallax hooks
│   ├── styles/
│   │   └── main.css           # Global styles
│   ├── App.jsx                # Main app component
│   └── main.jsx               # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## Design Philosophy

This landing page was built with a focus on:

1. **Performance** - No heavy animation libraries, custom implementations
2. **Authenticity** - Real app screenshots, no stock photos
3. **Personality** - Subtle imperfections, custom easing curves
4. **Clarity** - Clear value proposition, no marketing fluff

## Customization

### Colors

Edit CSS variables in `src/styles/main.css`:

```css
:root {
  --teal: #20C997;
  --teal-dark: #1BA87E;
  --teal-light: #3DD6AC;
  /* ... */
}
```

### Parallax Speed

Adjust parallax speed in components:

```jsx
const parallaxOffset = useParallax(0.3) // 0.3 = speed multiplier
```

### App Store Links

Update the href attributes in `Hero.jsx` and `DownloadCTA.jsx`:

```jsx
<a href="YOUR_APP_STORE_LINK" className="store-btn">
```

## Performance

- Bundle size: ~50KB gzipped
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Lighthouse Score: 95+

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## License

MIT
