# Technical Documentation

> Technical decisions and implementation notes for developers.

---

## Technology Stack

- **HTML5** - Semantic markup with proper ARIA labels
- **CSS3** - Custom properties (CSS variables) for theming, Flexbox/Grid for layout
- **Vanilla JavaScript** - No frameworks, ~500 lines of clean ES6+
- **PWA** - Service Worker + Web App Manifest for installability

## Why No Framework?

This is a small, focused app with limited interactivity. Vanilla JS keeps it:
- Fast to load (no framework overhead)
- Easy to maintain (no build step, no dependencies)
- Future-proof (no framework version to update)

---

## File Structure

```
/
├── index.html          # Main HTML document
├── styles.css          # All styles with CSS variables for themes
├── app.js              # Application logic
├── sw.js               # Service Worker for offline support
├── manifest.json       # PWA manifest
└── icons/
    ├── favicon.svg     # Vector favicon
    ├── icon-192.png    # PWA icon (192x192)
    ├── icon-512.png    # PWA icon (512x512)
    └── apple-touch-icon.png  # iOS icon (180x180)
```

---

## Data Schema

Data is stored in localStorage under the key `yearProgress`:

```javascript
{
  year: 2026,                    // Current year being displayed
  days: {                        // Object of marked days
    "2026-01-15": {
      color: "#FFB7C5",          // Optional: hex color
      emoji: "❤️",               // Optional: single emoji
      note: "Great day!"         // Optional: up to 280 chars
    }
  },
  theme: "sakura",               // Current theme: sakura|mint|lavender|honey
  lastUpdated: "2026-01-15..."   // ISO timestamp of last change
}
```

---

## Theming System

Themes are implemented via CSS custom properties on `:root`. Changing themes:

1. Set `data-theme` attribute on `<html>` element
2. CSS uses `[data-theme="name"]` selectors to override variables
3. Theme preference saved to localStorage

Available themes:
- `sakura` (default) - Pink/cream
- `mint` - Mint green/teal
- `lavender` - Purple/pink
- `honey` - Peach/gold

---

## Service Worker Strategy

- **Install**: Pre-cache all static assets
- **Activate**: Clean up old cache versions
- **Fetch**: Cache-first for local assets, network-first for external

Cache versioning via `CACHE_NAME` constant. Bump version to force update.

---

## Browser Compatibility

Tested and works on:
- iOS Safari 14+
- Android Chrome 90+
- Desktop Chrome, Firefox, Safari, Edge (latest versions)

Key features used:
- CSS Grid and Flexbox
- CSS Custom Properties
- ES6+ (const, let, arrow functions, template literals)
- LocalStorage API
- Service Worker API

---

## Known Limitations

1. **Year rollover**: App shows current year only. Old year data persists in localStorage but isn't displayed.

2. **Storage limit**: LocalStorage typically limited to 5-10MB. With ~365 days × ~500 bytes max per day = ~180KB max per year. Not a concern.

3. **No sync**: Data lives on device only. Backup/restore is manual.

---

## Future Improvements

If expanding this app:
- IndexedDB for larger data storage
- Cloud sync (would need accounts)
- Year-over-year comparison view
- Custom emoji picker
- Haptic feedback on supported devices

---

## Deployment

Recommended: Deploy to any static hosting:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

No build step required - just serve the files as-is.

### HTTPS Required

Service Workers require HTTPS (except localhost for development).

---

## Development

To run locally:

```bash
# Any static server works
python3 -m http.server 8085
# or
npx serve .
# or
php -S localhost:8085
```

Then open http://localhost:8085

---

*Last updated: December 2025*
