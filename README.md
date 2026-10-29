# Hardik Sharma — Portfolio

[![Live portfolio](https://img.shields.io/badge/Live-sharmahardik59.github.io-7c3aed?style=for-the-badge&logo=googlechrome&logoColor=white)](https://sharmahardik59.github.io/)

**🌐 Live site: https://sharmahardik59.github.io/**

Personal portfolio of Hardik Sharma, Senior React Native Engineer & Technical Lead — 10.4 years building iOS and Android apps with React Native, TypeScript, Swift and SwiftUI.

Plain HTML, CSS and JavaScript — no build step, no dependencies. Hosted on GitHub Pages.

## Structure

- `index.html` — all page content (skills, experience, projects, repos)
- `styles.css` — theme tokens (dark / light), surfaces, layout; sections are numbered in the header comment
- `theme-init.js` — runs before first paint: picks the theme and refuses to render inside another site's frame
- `script.js` — one `init…` function per feature (theme, menu, scroll, reveal, skills line, skill tabs, contact, protection, GitHub stars)
- `robots.txt` — lets search engines index the page, blocks AI-training crawlers and `/assets/`, points to the sitemap
- `sitemap.xml` — the page URL for Google Search Console / Bing Webmaster Tools
- `og-image.jpg` — preview image shown when the link is shared on LinkedIn, WhatsApp, X, Slack
- `github-profile/README.md` — profile README for the `sharmahardik59/sharmahardik59` repository (not part of the site)

## SEO

- Title, meta description, keywords and canonical URL target "Senior React Native Developer", "React Native Tech Lead", iOS / Swift and BLE / IoT searches.
- One `<h1>` (name + role) and keyword-rich `<h2>` headings for every section.
- Open Graph + Twitter card tags for rich link previews.
- `schema.org` JSON-LD (`ProfilePage`, `Person`, `WebSite`) with job title, location, skills, education and profile links.
- After publishing, submit `https://sharmahardik59.github.io/sitemap.xml` in Google Search Console.
- `assets/Hardik_Sharma_Resume.pdf` — downloadable CV
- `assets/profile.jpg` — profile photo (square 900×900), shown as a CSS background so browsers don't offer "Save image"

## Security & protection

- **Content Security Policy** (meta tag): scripts and styles only from this site and Google Fonts, network calls only to `api.github.com`, no plugins, no forms, no `<base>` hijacking. There are no inline scripts or `style=""` attributes, so none are allowed.
- **Clickjacking guard:** GitHub Pages can't send `X-Frame-Options`, so `theme-init.js` hides the page and breaks out if it is framed.
- **External links** use `rel="noopener noreferrer"`; the referrer policy is `strict-origin-when-cross-origin`.
- **Email and phone** are not in the HTML; `script.js` assembles them at runtime so simple scrapers can't harvest them. Without JavaScript the contact links fall back to LinkedIn.
- **Copy deterrents:** text selection, right-click, drag, copy/cut, and the save / view-source / print shortcuts are blocked, and printing shows a notice instead of the page. These stop casual copying only — anything a browser displays can still be screenshotted or read with developer tools.

## Run locally

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Update content

- **Skill level:** change `data-level`, the badge text and the bar's `data-w` (0–100) on the skill card.
- **New skill in the typing line / tech strip:** add an `<li>` to both copies of the right `marquee-track` row.
- **New repo:** copy a `.repo` card in the Open Source section and set `data-repo="owner/name"`.
- **Contact details:** edit `CONTACT` at the top of `script.js`.
