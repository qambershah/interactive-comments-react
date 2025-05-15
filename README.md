# 💬 Interactive Comments App

A modern, threaded comment and reply system built with **React 19 + TypeScript**.

---

## 🚀 Features
- ✅ Add top-level comments
- 💬 Reply to any comment (nested threading)
- 👤 Current user support via React Context
- 📁 Local JSON as mock backend
- 🖼️ Avatars, timestamps, and basic styling
- ⚛️ Clean, reusable architecture

---

## 🔧 Tech Stack
- [React 19 (w/ modern JSX)](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev) for fast dev + build
- [GitHub Actions](https://github.com/features/actions) for deployment
- GitHub Pages (static hosting)

---

## 🧪 Local Development

```bash
git clone https://github.com/<your-username>/interactive-comments-react.git
cd interactive-comments-react
npm install
npm run dev
```

---

## 🌍 Live Demo

[🔗 View on GitHub Pages](https://<your-username>.github.io/interactive-comments-react/)

---

## 🚚 Deploy (Auto via GitHub Actions)

GitHub Actions is configured to auto-deploy `dist/` to the `gh-pages` branch on every `main` branch push.

Ensure `vite.config.ts` has:
```ts
base: '/interactive-comments-react/'
```

---

## 📁 Project Structure

```
src/
├── components/         // Reusable components like CommentItem, CommentForm
├── contexts/           // Current user context (provider + hook)
├── hooks/              // useComments hook for state and fetching
├── types/              // TypeScript types (Comment, User)
└── App.tsx             // App root
```

---

## 📝 License
MIT

---

Feel free to fork and adapt this for your own comment/chat systems!
