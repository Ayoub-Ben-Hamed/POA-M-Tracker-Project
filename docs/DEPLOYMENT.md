# Deployment Guide

This guide explains how to run the POA&M Tracker locally, build it for production, and deploy it to GitHub Pages. It assumes you have Node.js installed and basic familiarity with the command line.

## 1. Running Locally

To run the application in development mode with hot-module reloading:

1. Open your terminal and navigate to the project directory:
   ```bash
   cd poam-tracker
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the URL provided in the terminal (usually `http://localhost:5173/`) in your browser.

## 2. Building for Production

When you're ready to deploy, you need to create an optimized production build:

1. Run the build command:
   ```bash
   npm run build
   ```
2. Vite will process your code, optimize assets, and generate a `dist/` directory. 
   - The `dist/` folder contains the compiled, minified HTML, CSS, and JavaScript files that are ready to be served by any static file server.
   - Because `base: "./"` is set in `vite.config.js`, all asset links in the generated `index.html` are relative, making it easy to deploy to subdirectories like GitHub Pages.

## 3. Deploying to GitHub Pages

GitHub Pages is a free service that hosts static websites directly from a GitHub repository.

### Prerequisites

1. You must have a GitHub account.
2. The project must be initialized as a Git repository and pushed to GitHub.

### Step-by-Step Deployment

1. **Install the `gh-pages` package as a dev dependency:**
   ```bash
   npm install -D gh-pages
   ```

2. **Update `package.json`:**
   Add these two scripts to the `"scripts"` section of your `package.json`:
   ```json
   "scripts": {
     // ... other scripts
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
   *(Note: The `predeploy` script automatically runs `npm run build` before every deployment to ensure you are deploying the latest code.)*

3. **Deploy the application:**
   Run the deploy script:
   ```bash
   npm run deploy
   ```
   - This command will build the project and push the contents of the `dist/` folder to a special branch in your repository named `gh-pages`.

4. **Configure GitHub Pages settings:**
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages** (on the left sidebar).
   - Under **Build and deployment**, ensure the **Source** is set to "Deploy from a branch".
   - Under **Branch**, select `gh-pages` and `/ (root)` folder, then click **Save**.

5. **Access the deployed URL:**
   - Your site will be published at `https://<your-username>.github.io/<repository-name>/`.
   - It may take a minute or two for the changes to propagate on the first deployment.

## 4. Verifying the Deployment

Once the site is live, verify that it works correctly:

1. Open the deployed URL in an incognito/private browser window (to ensure a clean state).
2. The dashboard should load and display the default 28 seed items.
3. Make a change (e.g., add a new POA&M or edit an existing one).
4. Refresh the page. Because the app uses `localStorage`, your changes should persist across reloads.
5. Check that the charts render correctly and the CSV export works.

## 5. Common Issues and Fixes

- **Blank White Page:** 
  - *Cause:* Incorrect base path for assets.
  - *Fix:* Ensure `base: "./"` is present in `vite.config.js`. If you are still having issues, you may need to explicitly set the base path to your repository name: `base: "/<repository-name>/"`.
- **404 Errors on Reload:**
  - *Cause:* GitHub Pages doesn't natively support client-side routing.
  - *Fix:* This project avoids this issue by using state-based routing (`currentPage` in `App.jsx`) instead of URL-based routing (like React Router), so reloads on the main URL will always work.
- **Data Not Saving:**
  - *Cause:* Browser privacy settings blocking `localStorage` or viewing the page in an iframe with strict cross-origin policies.
  - *Fix:* Ensure you are viewing the site directly and not blocking cookies/local data.
