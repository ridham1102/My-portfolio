# Ridham Arora — Data Science Portfolio

A fast, single-page portfolio for **Ridham Arora**, Jr. Data Scientist at Pranjali Grow Cap —
building data-driven options trading strategies, fast backtesting pipelines, and interactive
analytics dashboards.

🔗 **Live:** https://lovely-khapse-81ca38.netlify.app/

## Highlights
- **Hero + About + Experience** — quant/options work at Pranjali Grow Cap (Python + Polars backtesting pipeline).
- **Interactive Options Backtesting Dashboard** — a PnL heatmap (weekday × days-to-expiry) and a
  cumulative equity curve, switchable across NIFTY / BANKNIFTY / FINNIFTY.
  *(Uses representative sample data — swap in a real CSV export in `app.js`.)*
- **Project case studies** — Car Price Prediction (R² = 0.86), Biodiversity EDA, Kindle NLP sentiment, and more.
- **Skills, certifications, résumé download, and a working contact form.**

## Tech
Plain **HTML · CSS · JavaScript** + **Chart.js** (CDN). No build step — open `index.html` or host anywhere static.

## Run locally
```bash
# any static server, e.g.
python -m http.server 8000
# then visit http://localhost:8000
```

## Project structure
```
index.html        # markup + meta/OG tags
style.css         # "Quant Terminal" dark theme
app.js            # nav, scroll reveal, counters, dashboard demo, contact form
assets/           # favicon, social image, résumé (PDF)
```

## Deploy
- **Netlify** — drag-and-drop the folder, or connect this repo. The contact form uses Netlify Forms automatically.
- **GitHub Pages** — Settings → Pages → deploy from `main` / root. The contact form falls back to email.

## Contact
- ✉️ aridham1102@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/ridhamarora1/)
- 🐙 [GitHub](https://github.com/ridham1102)
