# BuyWise — Compare Smarter. Save Better.

BuyWise is a polished university entrepreneurship MVP for comparing clearly labeled sample prices, tracking products, setting target prices, and exploring simulated discounts. It is built entirely with React, TypeScript, Tailwind CSS, Vite, Recharts, and browser local storage.

> Demo notice: BuyWise does not show live retailer prices, process payments, or claim retailer partnerships. All product data, prices, ratings, histories, coupons, savings, and alerts are simulated.

## Features

- Search and category filters for real, recognizable products
- Price + shipping comparisons across Amazon, Walmart, Target, and Best Buy
- Lowest-total ranking and potential savings calculation
- Local watchlist with target prices and notification preferences
- Recharts-powered six-month sample price history
- Simulated price-drop notifications
- Clearly labeled coupon examples
- Free and Premium plan comparison with no payment processing
- Responsive navigation and layouts for phone, tablet, and desktop
- Product-specific searches on official retailer websites

## Run locally

Requirements: Node.js 20 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local URL shown by Vite.

## Validate the project

```bash
pnpm test
pnpm typecheck
pnpm build
```

The automated journey test covers search, comparison, watchlist persistence, target-price editing, and the simulated price-drop alert.

## Project structure

```text
src/
  App.tsx          Pages, components, navigation, and interactions
  data.ts          Real product names, simulated offers, retailer searches, and coupons
  types.ts         Shared TypeScript models
  useBuyWise.ts    Local-storage watchlist state
  index.css        Tailwind layers and BuyWise visual system
  test/            Core user-journey test and browser mocks
```

## Publish to GitHub

This workspace is prepared for `Ray106/BuyWise`.

```bash
git add .
git commit -m "Build BuyWise MVP"
git push -u origin main
```

If you are starting from a fresh download instead, run `git init -b main` and add the remote first:

```bash
git remote add origin https://github.com/Ray106/BuyWise.git
```

## Deploy to Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the `Ray106/BuyWise` GitHub repository.
3. Keep **Framework Preset** as Vite.
4. Use `pnpm build` as the build command and `dist` as the output directory if Vercel does not detect them automatically.
5. Select **Deploy**.

`vercel.json` contains the SPA rewrite needed for stable client navigation. No environment variables are required.

## Customize the demo

- Edit products, prices, price histories, and retailer links in `src/data.ts`.
- Update brand tokens and typography in `tailwind.config.js` and `src/index.css`.
- Local-storage data uses the key `buywise-watchlist-v1`; increment the suffix when making a breaking data-model change.
- Replace the sample data layer with a licensed retailer API only after reviewing its terms and adding accurate attribution and freshness messaging.
