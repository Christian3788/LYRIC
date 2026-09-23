# Contributing to DOODLE 🎵

Thank you for your interest in contributing to **DOODLE**! We welcome contributions of all kinds: bug reports, documentation improvements, feature suggestions, code refactoring, and new pull requests.

---

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat everyone in the community with respect and empathy.

---

## 🛠️ Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or higher
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- [Git](https://git-scm.com/)

### Step-by-Step Setup

1. **Fork the Repository**  
   Click the **Fork** button at the top right of the GitHub repository page.

2. **Clone your fork**
   ```bash
   git clone https://github.com/<your-username>/doodle.git
   cd doodle
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Environment Variables**
   ```bash
   cp .env.example .env
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the live application.

---

## 🌿 Branch & Git Conventions

- Create a feature branch with a descriptive name:
  - `feature/add-equalizer-preset`
  - `fix/audio-range-buffer-overflow`
  - `docs/update-architecture-diagram`
- Write clear, concise commit messages following [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat: add Audius waveform visualizer`
  - `fix: resolve race condition in party sync room`
  - `docs: improve streaming worker setup instructions`

---

## 🧪 Quality & Verification

Before submitting your pull request, verify that your changes build and compile without errors:

```bash
# Typecheck
npm run lint

# Production build test
npm run build
```

---

## 🚀 Submitting a Pull Request (PR)

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of the upstream repository.
3. Fill out the PR template describing the problem, your solution, and how it was tested.
4. Maintainers will review your PR and may suggest improvements. Once approved, it will be merged!

---

## 💡 Questions or Ideas?

Feel free to open an **Issue** or start a **GitHub Discussion** to pitch new ideas or ask architectural questions!
