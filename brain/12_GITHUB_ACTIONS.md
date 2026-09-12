# 12 // CI/CD & GITHUB ACTIONS SPECIFICATION

## 1. WORKFLOW PIPELINE
The automated workflow runs on pull requests and pushes to `main`:

```yaml
name: LIFE//OS Continuous Integration

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validate-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: TypeScript Static Analysis
        run: npm run lint

      - name: Production Vite Build
        run: npm run build
```

## 2. ARTIFACTS
- Builds emit static assets to `/dist` ready for immediate edge hosting (Cloud Run, Vercel, Firebase Hosting, GitHub Pages).
