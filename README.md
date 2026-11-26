# Interactive Comments

A threaded comment demo with a React and TypeScript frontend and an ASP.NET Core API. The frontend is configured for GitHub Pages; the API project can be run locally or deployed separately.

## Features

- Create comments and nested replies
- Edit and delete comments shown as belonging to the demo user
- Upvote and downvote comments
- Encode comment text on the API before returning it
- Keep comments in process memory

## Stack

- React 19.3, TypeScript, and Vite 8
- ASP.NET Core / .NET 10 Web API
- AWS Lambda and API Gateway deployment files
- GitHub Actions workflow for the frontend

## Run locally

Install Node.js 26 LTS and the .NET 10 SDK. The `.nvmrc` file sets the Node.js major version used by local development and GitHub Actions. From the repository root, install dependencies and configure the frontend:

```sh
cp .env.example .env
npm ci
npm run dev
```

Set `VITE_API_URL` in `.env` to the API's comments endpoint. `VITE_API_KEY` can be set if the API Gateway deployment requires a usage-plan key. The frontend will need the API's CORS policy to allow the Vite origin.

Run the API from `api/InteractiveCommentsApi` with `dotnet run`. Use the URL printed by ASP.NET Core as the API host and append `/api/Comments`.

## Checks

Run the frontend tests, lint, and production build from the repository root. Run the API test suite from the repository root:

```sh
npm test
npm run lint
npm run build
dotnet test api/InteractiveComments.sln
```

## Checks and deployment

Pull requests targeting `main` run the API tests, frontend tests, lint, and frontend production build. After changes are merged to `main`, the deployment workflow reruns those checks and publishes the Vite output to GitHub Pages.

The Vite app uses `/interactive-comments-react/` as its base path for GitHub Pages. Set the repository variables `VITE_API_URL` and, if required, `VITE_API_KEY` so the workflow can include them in the frontend build. Values prefixed with `VITE_` are public in the browser bundle; do not put secrets there. Set the repository's Pages publishing source to **GitHub Actions**. The API is deployed separately using the AWS Lambda tooling; the frontend workflow does not deploy it.

## Demo limitations

The current user is hard-coded as `yoda`. Edit and delete controls are shown by comparing that username with the comment's username; this is a UI convenience, not authentication or authorization. The API accepts the user supplied by the client, so do not use this demo to store private or trusted user content.

Comments live in process memory and can disappear when the API process or Lambda execution environment restarts. The API Gateway usage-plan key is sent by the browser, so it is visible to visitors and should be treated as a rate-limiting identifier, never as a secret. There is no real-time sync; the frontend reloads the comments after its own mutations.

## License

MIT
