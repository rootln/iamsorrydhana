# L N — Where Heaven Begins

A cinematic, interactive personal love letter from **Niraj (N)** to **Lipi (L)**, affectionately called Maakdi.

## What is inside

- **Scroll-scrubbed golden gateway:** a custom CSS 3D gate opens onto an illustrated flower meadow. Scroll forwards to open, backwards to close. It uses native scrolling, so it does not trap mobile or keyboard users.
- **Nine memory chapters:** uses the nine Cloudinary links you provided, in the same order, with captions written to suit the photographs.
- **GPU picture transitions:** a custom WebGL morph shader with brightness-sensitive, fractal-noise dissolves adapted from your supplied `morph-gallery.tsx` example. The gallery falls back to plain photographs if WebGL or CORS is unavailable.
- **A heartfelt apology letter:** honest and personal, without asking Lipi to forgive you on the spot.
- **Interactive ending:** a gentle hug animation; no background music or autoplay audio.
- **An animated identity:** an L ♡ N monogram, animated typography, parallax backgrounds, staggered section reveals, glow/light sweeps, gentle photo zooms, simulated 3D photo tilt, and motion designed for desktop and mobile.
- **Love that scrolls forever:** the final call to action opens the heart-shaped **THIS MUCH. ❤️** reveal and an on-demand stream of love notes. New panels are appended as the visitor scrolls. Older panels are recycled so the page can continue without bound without memory bloat. A persistent **back to our story** button closes it.
- **Responsive and accessible:** swipe, buttons, thumbnail navigation, keyboard arrow support, reduced-motion support, skip-intro link and a clear exit from the endless-scroll section.

## Deploy to GitHub Pages (no terminal needed)

1. Create a new GitHub repository, e.g. `for-lipi`.
2. Upload **all the contents of this folder**, preserving `assets/`, into the repository root. Upload the files themselves, not the `.zip`.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`, then click **Save**.
6. Wait a minute or two for Pages to publish. Your link will be `https://YOUR_USERNAME.github.io/for-lipi/` (if your repository is named `for-lipi`).

**No npm, React build, GitHub Action, API key, or server is required.** Simply open `index.html` locally to preview. All paths are relative so the site works under a GitHub Pages subdirectory.

## Editing content

- **Names and letter:** edit `index.html`.
- **Photo links and one- or two-line descriptions:** edit the `PHOTOS` array at the beginning of `main.js`.
- **Colours, spacing, animation:** edit `styles.css`; the animation controllers and endless-scroll generator are in `main.js`.
- **Endless scroll love notes:** edit the `notes` array in `initInfinity()` in `main.js`; `appendBatch()` controls how many are generated.
- **L N identity:** edit the site header, corner initials and footer in `index.html`.
- **The flower meadow:** `assets/heaven-meadow.svg` is a locally bundled illustration; it loads even without access to a stock-image service.

## Image note

The gallery uses the nine **Cloudinary URLs you supplied**, so those original images need to remain public on Cloudinary. The first URL is HEIC; the site requests Cloudinary's automatic browser-friendly conversion (`f_auto,q_auto`) for it. If any Cloudinary photo cannot load, the site uses one of the four locally bundled photographs from the images you previously shared, as a graceful fallback. To make the website completely self-contained, download your nine Cloudinary photos and replace their URLs in `main.js` with local file paths.

## Privacy note

The site contains personal photos and a personal letter. **Anyone who has your public GitHub Pages URL can view or share it.** Don't include call-log screenshots or phone numbers. GitHub Pages in a standard public repository does not provide password protection.

## Technical note about the two reference prompts

The supplied references were React/TypeScript/shadcn-targeted components (`scroll-locked-video-hero.tsx` and `morph-gallery.tsx`). A direct copy would require React, a bundler, and a custom video showing a flower-field gate instead of the city in its demo. For a site you can publish straight from GitHub Pages, their interactions were faithfully **adapted** to small browser-native CSS/JavaScript/WebGL modules: a scrubbable, openable gate in place of the reference video, and the reference's fBm/noise/light-based image morph. This is a standalone static implementation, **not** a shadcn/React project. Both original text references are included under `references/` for transparency and future migration.

Made with love, not excuses. ♡

## New experience walkthrough

1. Scroll to swing the golden gates open into the flower meadow.
2. Scroll through the story introduction. Each heading reveals word by word.
3. Use arrows, thumbnails, swipe, or keyboard keys to explore nine photographs, with animated text and a light-biased noise-morph transition. The image fallback has its own slow zoom/crossfade.
4. Read the letter and the final promise.
5. Click **“click here to see how much I love you”**, then keep scrolling. The stream is intentionally endless. Use **“back to our story ↑”** to close it at any time.

Motion is reduced or removed for visitors who enable the operating system’s **Reduce Motion** accessibility setting. The site contains no autoplay music.
