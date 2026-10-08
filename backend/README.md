# Backend - Running locally

Prerequisites:
- Node.js (LTS) and `npm` on PATH
- MongoDB running locally or a MongoDB connection string (Atlas)

Quick start (PowerShell):

```powershell
# 1. Install dependencies
Set-Location -LiteralPath 'D:\SVVVV\Sri Vrindas\sri vrindas catering\backend'
npm install

# 2a. If you run MongoDB locally as a service
# net start MongoDB

# 2b. Or run mongod manually (example)
# mkdir C:\data\db
# mongod --dbpath "C:\data\db"

# 3. (Optional) Set a custom Mongo URI
# $env:MONGO_URI = 'mongodb://localhost:27017/sri-vrindas'

# 4. Start the website and its data-analysis dashboard together
npm run start:dev

# Or start only backend:
# npm run dev
```

Notes:
- The server reads `MONGO_URI` and `PORT` from environment variables. If not provided it falls back to `mongodb://localhost:27017/sri-vrindas` and port `3000`.
- To use a `.env` file install `dotenv` (`npm install dotenv`) and create a `.env` with `MONGO_URI` and/or `PORT` keys.# React + TypeScript + Vite

The website frontend runs on Vite port `5180` and proxies `/api` and `/uploads` to the backend on port `3000`. The admin panel's `/admin-analysis` page displays the uploaded SV Data Viewer without changing its dashboard output. `npm run start:dev` also starts that dashboard on port `3001` and its analytics API on port `5000`; the analysis API uses the `svdb` MongoDB database by default.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
