# Haiwad Products Canada website

A static, responsive website split into HTML, CSS, JavaScript, and image assets.

## Preview

Open `index.html` in a browser, or serve this folder from a static host. For local testing, run `python -m http.server 8000` from this folder and open `http://localhost:8000`.

## Deploy

Upload the contents of this folder to the root directory of a static hosting account. Keep the `styles`, `scripts`, and `assets` folders beside `index.html` so their relative paths continue to work.

## Contact form

The contact form validates the required fields and prepares an email in the visitor's default mail app addressed to `Haiwadproductscanada@gmail.com`. It does not send automatically. To receive submissions without requiring visitors to have a configured mail app, connect the form to a secure form service or a backend endpoint before deployment.

## External media

Existing product photos and the promotional video still load from `haiwad.com`; the supplied Haiwad logo is included locally in `assets/`.
