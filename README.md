# Vijay Soni - Senior Software Engineer Portfolio

A premium, modern portfolio website and sidecraft catalog built using React.js and Vite. It serves as a professional showcase of experience, competencies, and interactive utility engines.

---

## 🚀 Key Features

### 1. Interactive Landing Page
* **Cursor-Following Spotlight Glow:** A dynamic page-wide radial spotlight gradient overlay that tracks viewport cursor movement to highlight dark-theme card components.
* **Responsive Fluid Design:** Clean layouts optimized for mobile and desktop screens with custom typographic scale structures.
* **Scroll-Reveal Animations:** Staggered micro-animations that slide elements organically into view on scroll.

### 2. Kalachakra (Sidecraft Project)
* **Hindu Luni-Solar Calendar Engine:** An advanced, offline-first client-side calculation utility built with local astronomical coordinates.
* **Dynamic Calculations:** Computes Tithis, Nakshatras, Yogas, and Sun/Moon rise/set timings locally.
* **Aged Accessibility Support:** Font scale controls designed for readability, high-contrast dark styles, and translations in 9 Indian languages.

### 3. AI Agent & LLM Crawling Endpoints
* **JSON-LD Schema:** Injected semantic `Person` script schemas for Google/Bing structured search.
* **llms.txt:** A clean Markdown profile in `/llms.txt` for AI crawlers (like Gemini, ChatGPT) to fetch and index your resume credentials in milliseconds.
* **portfolio.json:** A structured data endpoint serving the raw resume data directly in JSON.

---

## 🛠️ Technology Stack

* **Frontend Framework:** React.js (v18+)
* **Build Bundler:** Vite (v8+)
* **Routing System:** React Router Dom (v7+)
* **Icon Packs:** Lucide React & React Icons (Fa6)

---

## 📦 Directory Structure

```bash
├── public/
│   ├── llms.txt             # Markdown summary for LLM scrapers
│   ├── portfolio.json       # JSON credentials endpoint
│   ├── site.webmanifest     # Web Manifest file
│   └── favicon assets
├── src/
│   ├── components/          # Reusable UI controls (Navbar, Layout wrappers)
│   ├── data/
│   │   ├── portfolioData.js # Static profile credentials structure (Plain JSON)
│   │   └── toolsData.js     # Sidecraft registry metadata
│   ├── pages/               # Routing views (Home, Sidecrafts catalog)
│   ├── tools/
│   │   └── panchang/        # Kalachakra engine code modules
│   └── utils/
│       └── portfolioHelpers.js # Mathematical calculations & string interpolation
```

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```

### 3. Build Production Bundle
```bash
npm run build
```

