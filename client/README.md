# BusLink Frontend

React + TypeScript + Vite frontend application for BusLink bus ticket booking platform.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

Output: `dist/frontend/`

### Environment Variables

Create `.env.local` file:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=BusLink
```

For production builds, set these as environment variables in your hosting platform.

## 📦 Deployment

### Vercel
```bash
npm install -g vercel
vercel --prod
```

Set environment variable: `VITE_API_URL`

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist/frontend
```

### Static Hosting
Build and deploy the `dist/frontend/` folder to any static hosting service.

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type check

## 📁 Structure

```
client/
├── src/
│   ├── components/    # UI components
│   ├── pages/        # Page components
│   ├── lib/          # Utilities, API client
│   └── hooks/        # React hooks
├── public/           # Static assets
└── index.html        # Entry HTML
```

## 🌐 API Configuration

The frontend connects to the backend API via `VITE_API_URL` environment variable.

Default: `http://localhost:5000`

See `src/lib/api.ts` for API client implementation.

