# VNPy Web Client

A modern React-based web client for the VNPy trading platform.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **Ant Design (antd)** - UI component library
- **Axios** - HTTP client

## Features

- 📊 Dashboard with real-time statistics
- 💹 Trading interface for placing and managing orders
- 📈 Market data viewer
- ⚙️ Settings and configuration
- 🎨 Modern, responsive UI with Ant Design
- 🔄 State management with Zustand
- 🛣️ Client-side routing with React Router

## Getting Started

### Installation

```bash
cd web
npm install
```

### Development

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`

### Build

```bash
npm run build
```

This will create an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
web/
├── src/
│   ├── components/       # Reusable components
│   │   └── Layout.tsx   # Main layout with sidebar
│   ├── pages/           # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Trading.tsx
│   │   ├── Market.tsx
│   │   └── Settings.tsx
│   ├── store/           # Zustand stores
│   │   ├── useAppStore.ts
│   │   └── useTradingStore.ts
│   ├── services/        # API services
│   │   └── api.ts
│   ├── App.tsx          # Main app component with routes
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## State Management

The app uses Zustand for state management with two main stores:

- **useAppStore**: Global app state (user, connection status, theme)
- **useTradingStore**: Trading-specific state (positions, orders)

## API Integration

The app is configured to proxy API requests to the backend server running on `http://localhost:8000`. Update the proxy configuration in `vite.config.ts` if needed.

## Environment Variables

Create a `.env` file in the web directory:

```
VITE_API_URL=http://localhost:8000
```

## License

MIT


