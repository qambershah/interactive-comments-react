# 💬 Interactive Comments – Full-Stack Serverless App (React + .NET + AWS)

A modern threaded comment system:

* **Frontend** – React 19 + TypeScript (Vite) — hosted on **GitHub Pages**  
* **Backend** – .NET 8 REST API running on **AWS Lambda** behind **API Gateway**  
* **Infra** – Deployed with the .NET Lambda CLI + API‑key Usage Plan for rate‑limiting

---

## 🚀 Features

| Area | Details |
|------|---------|
| 📝 Comments | Add, reply (nested), edit, delete (auth‑guarded to current user) |
| 📊 Voting    | Up‑vote / down‑vote, list auto‑sorted by score |
| 🔑 Protection | API key + API Gateway usage‑plan throttling (burst 5 rps / 1000 req‑day) |
| 🗄️ Persistence | In‑memory seed from `Seed/comments.json` (persists while Lambda is warm) |
| 🌐 CORS | Cross‑origin allowed for `https://qambershah.github.io` |
| 🛡️ XSS Safe | Comment body sanitised server‑side with `HtmlEncoder` |
| 📜 OpenAPI | Swagger UI available locally at `/swagger` |
| ⚙️ CI/CD | React auto-deploys to GitHub Pages via Actions; Lambda deployed via CLI (CI/CD pending) |

---

## 🔧 Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 19 • TypeScript • Vite |
| Backend  | .NET 8 Minimal API |
| Cloud    | AWS Lambda • API Gateway (REST API) • IAM |
| Dev Tools| AWS Lambda .NET CLI • GitHub Actions |

---

## 🧑‍💻 Local Development

```bash
# clone
git clone https://github.com/qambershah/interactive-comments-react.git
cd interactive-comments-react

# 1️⃣ Frontend
cp .env   # then set variables
npm install
npm run dev                  # Vite dev server

# 2️⃣ Backend (.NET 8)
cd api/InteractiveCommentsApi
dotnet run                   # runs on http://localhost:5000
```

> **ENV** – Frontend reads `VITE_API_URL` & `VITE_API_KEY` from `.env`.

---

## 🌍 Live Demo

[🔗 Live Demo on GitHub Pages](https://qambershah.github.io/interactive-comments-react/)

---

## 🚚 Deploy (Auto via GitHub Actions)

GitHub Actions is configured to auto-deploy `dist/` to the `gh-pages` branch on every `main` branch push.

Ensure `vite.config.ts` has:
```ts
base: '/interactive-comments-react/'
```
---

## 📝 License
MIT

---

Feel free to fork and adapt this for your own comment/chat systems!