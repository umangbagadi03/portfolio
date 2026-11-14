# Umang Bagadi · portfolio

Personal site. Plain HTML, CSS and JavaScript: no build step, no framework.

## Update the site

Everything the site says is in **`data.js`**. Edit it, then push:

```bash
git add -A && git commit -m "Update site" && git push
```

Vercel redeploys automatically within a minute.

- **Add a project:** copy the template comment above `PROJECTS` in `data.js`.
- **Hide a project:** add `hide: true` to it.
- **Résumé button:** set `resume` in `data.js` to a link (e.g. Google Drive). Leave it empty to hide the button.

## Run locally

```bash
python3 -m http.server 5180
```

Then open http://localhost:5180.
