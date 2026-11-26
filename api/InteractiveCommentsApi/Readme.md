# Interactive Comments API

This is the ASP.NET Core API used by the React frontend. It targets .NET 10 and can run locally or as an AWS Lambda function behind API Gateway.

## Run locally

From the repository root:

```sh
dotnet run --project api/InteractiveCommentsApi
```

Use the local URL printed by ASP.NET Core, followed by `/api/Comments`, as `VITE_API_URL` in the frontend's `.env` file.

## Tests

From the repository root:

```sh
dotnet test api/InteractiveComments.sln
```

## AWS deployment

The SAM template is `serverless.template` and configures the `dotnet10` Lambda runtime. Configure an AWS profile and region, install or update the [Amazon.Lambda.Tools CLI](https://github.com/aws/aws-extensions-for-dotnet-cli), then deploy from this directory:

```sh
dotnet lambda deploy-serverless
```

The API uses in-memory storage for this demo. It does not provide authentication or durable storage.
