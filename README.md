# BitForge — Interactive Data Structures & Algorithms Learning Engine

[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal.svg)](https://tailwindcss.com/)

**BitForge** is a portfolio-grade, interactive educational web application designed for computer science students who find Data Structures & Algorithms intimidating. Instead of walls of static textbook pseudocode, BitForge provides step-through visual simulations, real-time code highlighting synchronized across multiple languages, plain-language narration, dynamic audio sonification, and competitive algorithm benchmarking.

---

## ✨ Flagship Capabilities

### 1. Unified Simulation Engine
- **Deterministic Step Generators:** Algorithms generate declarative snapshots with pointer annotations, active indices, and comparative narration rather than hand-rolled animations.
- **Synchronized Multi-Language Code Panel:** Active step pointers synchronously highlight corresponding lines in **Python**, **C++**, and **JavaScript**.
- **Interactive Playback Controls:** Play, pause, step forward, step backward, seek via timeline scrubber, and adjust playback speed (0.5x, 1x, 1.5x, 2x).

### 2. Comprehensive Curriculum Coverage
- **Foundations:** Asymptotic Big-O Analysis, Memory Architecture & Pointers
- **Sorting Algorithms:** Bubble Sort, Selection Sort, Insertion Sort, Quick Sort, Merge Sort, Heap Sort, Counting Sort, Radix Sort
- **Searching Algorithms:** Linear Search, Binary Search, Ternary Search
- **Linear Data Structures:** Singly Linked List, Doubly Linked List, Circular Linked List, Stack, Queue, Circular Queue, Deque, Priority Queue
- **Trees & Hierarchies:** Binary Search Tree, AVL Tree (with live self-balancing rotations), Min/Max Heap, Trie, Segment Tree, Fenwick Tree (Binary Indexed Tree)
- **Hashing & Collisions:** Hash Table with Separate Chaining & Open Addressing (Linear Probing)
- **Graphs:** BFS, DFS, Dijkstra's Shortest Path, Bellman-Ford, Floyd-Warshall, Kruskal's & Prim's MST, Topological Sort
- **Recursion & Backtracking:** Recursive Call-Stack (Factorial/Fibonacci), N-Queens, Subsets & Permutations, Maze Backtracking
- **Dynamic Programming:** 0/1 Knapsack, Longest Common Subsequence (LCS), Coin Change
- **Greedy Algorithms:** Activity Selection, Huffman Coding, Fractional Knapsack
- **Advanced Topics:** Union-Find / Disjoint Set (DSU), KMP String Matching, Bit Manipulation Tricks

### 3. "Race Mode" (Sorting Grand Prix)
- Select 2 or 3 sorting algorithms simultaneously and race them on the **exact same randomized dataset**.
- Live comparative counters: **Comparisons**, **Swaps / Writes**, and step count with podium rank calculation (1st, 2nd, 3rd place).
- Distribution presets: Random, Reverse Sorted, Nearly Sorted, and Few Unique.

### 4. Quiz Hub (Assessment Center)
- Centralized question bank spanning the entire syllabus.
- 3 test modes: **Quick Blitz** (5 questions), **Category Sprint** (10 questions), and **Comprehensive Exam** (15 questions).
- Instant pedagogical feedback with color-coded answer cards, detailed rationales, and audio cues.

### 5. Progress Tracking & Gamification
- Tri-state mastery tracking (`Not Started`, `Practicing`, `Mastered`) persisted in `localStorage`.
- XP rewards system with daily streaks, level progression, and curriculum completion metrics.

### 6. Universal Command Palette & Search
- Global search accessible via `Cmd+K` / `Ctrl+K` or `/` from any page.
- Fuzzy filtering by topic name, category, complexity, and difficulty tier.

### 7. Algorithmic Web Audio Synthesizer
- Built using Web Audio API to sonify algorithms into harmonic pentatonic frequencies.
- Real-time navbar equalizer button with global mute shortcut (`M`).

### 8. Full Accessibility (a11y)
- Full keyboard shortcuts (`Space` to play/pause, `←`/`→` to step, `R` to reset, `1-4` for speed).
- System and manual **Reduced Motion** toggle with persistent user preference.
- WCAG AA compliant contrast ratios and ARIA landmarking.

---

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio:** Web Audio API harmonic sound synthesis
- **Testing:** [Puppeteer](https://pptr.dev/) automated browser testing suite

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/watchknight/BitForge.git

# Navigate to the project directory
cd BitForge

# Install dependencies
npm install
```

### Development
```bash
# Start the local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
# Type check and build optimized static bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🌐 Deploy to Render

BitForge is pre-configured for **Render** via [`render.yaml`](render.yaml) with automatic SPA routing rewrites (`/* -> /index.html`), global CDN, and HTTPS.

### Option 1: Automatic Blueprint (Recommended)
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository: `https://github.com/watchknight/BitForge`.
4. Render will detect `render.yaml` and configure everything automatically.
5. Click **Apply** to launch!

### Option 2: Manual Static Site Setup
1. In the [Render Dashboard](https://dashboard.render.com/), click **New +** and select **Static Site**.
2. Connect `https://github.com/watchknight/BitForge`.
3. Configure the settings:
   - **Name:** `bitforge` (or your preferred name)
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Under **Redirects / Rewrites**, add:
   - **Type:** `Rewrite`
   - **Source:** `/*`
   - **Destination:** `/index.html`
5. Click **Create Static Site**.

---

## 📄 License
MIT License. Built for computer science learners worldwide.
