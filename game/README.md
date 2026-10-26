# Number Slide

A small, mobile-friendly sliding puzzle built with plain HTML, CSS, and JavaScript. It has no ads, analytics, external libraries, or third-party requests. The C# refresher project stays separate and unchanged.

## Play locally

Open `index.html` in a browser, or serve this folder with any static file server.

## Publish with GitHub Pages

1. Push this repository to GitHub. The Pages workflow publishes the `game` folder whenever you push to the `main` branch. If your default branch has a different name, update the branch in `.github/workflows/deploy-pages.yml`.
2. In the repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
3. At your DNS provider, create a `CNAME` record for `game` pointing to `cbjoed.github.io`. Do not put `https://` in the target. Remove conflicting DNS records for the `game` hostname.
4. In **Settings → Pages**, set the custom domain to `game.cbjoed.com`. Once DNS has propagated and GitHub has verified it, enable **Enforce HTTPS**.

The `CNAME` file is included in the published site so GitHub Pages can retain the custom domain.
