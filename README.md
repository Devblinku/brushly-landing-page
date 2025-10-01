# Brushly Landing Page

A modern, responsive landing page for Brushly - an AI-powered content creation platform for artists.

## Features

- 🎨 **Modern Design**: Beautiful gradient backgrounds and smooth animations
- 📱 **Responsive**: Optimized for all device sizes
- ⚡ **Fast**: Built with Vite for lightning-fast development
- 🎭 **Interactive**: Framer Motion animations and effects
- 🎯 **SEO Optimized**: Meta tags and structured content

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Router** for navigation

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx          # Main landing page component
│   └── ui/                      # Reusable UI components
│       ├── border-beam.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── container-scroll-animation.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── lamp.tsx
│       └── SmokeyCursor.tsx
├── lib/
│   └── utils.ts                 # Utility functions
├── styles/
│   └── responsive-system.css    # Custom responsive styles
├── index.css                    # Global styles
└── main.tsx                     # App entry point
```

## Customization

### Colors and Branding
- Update logo images in `/public/`
- Modify color schemes in `tailwind.config.js`
- Update brand colors in component files

### Content
- Edit text content in `LandingPage.tsx`
- Update testimonials, features, and platform data
- Modify form fields and validation

### Styling
- Custom styles in `src/index.css`
- Responsive breakpoints in `tailwind.config.js`
- Component-specific styles in individual files

## Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Recommended Hosting
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## License

MIT License - see LICENSE file for details.
