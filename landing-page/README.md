# OneTapExpense Landing Page

This folder contains a standalone static landing page.

## Local preview

Open `index.html` directly in your browser, or run a simple local server from this folder:

```bash
npx serve .
```

## Deployment notes

This page is intentionally isolated from the Expo app.

If you want to deploy it on Firebase Hosting, you can either:

1. Point a hosting target to this folder (`public: "landing-page"`), or
2. Keep your current `dist` hosting and deploy this page to a separate Firebase site target.
