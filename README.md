# Premium Jazz Quartet Website - V1

This is the foundational build for a single-page marketing site for a premium jazz quartet, built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Core Features (V1)

1.  **Global Layout**: Sticky top-nav (logo + "Book" button) that collapses into a hamburger on ≤768px.
2.  **Hero Section**: Full-viewport hero with a static poster image (`public/images/hero-poster.jpg`) and headline/callout copy.
3.  **Placeholder Sections**: Story, Music, Packages, Gallery, Contact — each 100vh with background color blocks.
4.  **Persistent CTA**: Gold pill "Book the Quartet" fixed bottom-right on desktop, bottom-bar on mobile.
5.  **Styling**: Brand color and font tokens wired into Tailwind (`tailwind.config.ts`).
6.  **Contact Form**: Basic stub (name, email, message) that console-logs on submit.

## Brand Tokens

*   **Colours**:
    *   Black: `#000000` (background)
    *   Gold: `#C9A35F` (accents/CTA)
    *   Midnight Blue: `#0D1B36`
    *   Champagne: `#E8DCC9`
*   **Fonts**:
    *   Headings: Playfair Display
    *   Body/UI: Inter

## Getting Started

### Prerequisites

*   Node.js (LTS version recommended - e.g., v18 or v20)
*   npm or yarn

### Setup

1.  **Clone the repository (if applicable) or ensure all generated files are in your project directory.**

2.  **Install Dependencies:**
    Open your terminal in the project root directory and run:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

3.  **Replace Placeholder Image:**
    Place your 1920x1080 hero poster image at `public/images/hero-poster.jpg`.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    or
    ```bash
    yarn dev
    ```

5.  **Open in Browser:**
    Navigate to [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

```
.
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── sections/
│   │   ├── StorySection.tsx
│   │   ├── MusicSection.tsx
│   │   ├── PackagesSection.tsx
│   │   ├── GallerySection.tsx
│   │   └── ContactSection.tsx
│   ├── ui/
│   │   └── Button.tsx
│   ├── NavBar.tsx
│   ├── Hero.tsx
│   ├── CTAButton.tsx
│   └── ContactForm.tsx
├── public/
│   └── images/
│       └── hero-poster.jpg
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
``` 