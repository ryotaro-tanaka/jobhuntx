# JobHuntX

<!-- ![Tests](https://github.com/ryotaro-tanaka/JobHuntX/actions/workflows/test.yml/badge.svg) -->


## Overview
JobHuntX is a job information scraping application developed using ASP.NET Core and React. This project aims to collect information from multiple job sites and provide tools to efficiently manage and search job postings.

## Key Features
- Job information scraping
- Search and filtering functionality
- User-friendly interface

## Setup
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repository/JobHuntX.git
    ```
2. Generate the API client:
    ```bash
    cd JobHuntX/JobHuntX.API
    dotnet nswag run nswag.json
    ```
3. Start the application using Docker Compose:
    ```bash
    cd ../
    docker-compose up --build
    ```
4. Once the application starts, access the following URL in your browser:
    ```
    http://localhost:5173
    ```

## Tech Stack

### 🧱 Core Technologies

![React](https://img.shields.io/badge/React--blue?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript--blue?logo=typescript&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core--blue?logo=dotnet&logoColor=white)
![Docker](https://img.shields.io/badge/Docker--blue?logo=docker&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions--blue?logo=githubactions&logoColor=white)

### 🛠️ Tooling & Utilities

![Vite](https://img.shields.io/badge/Vite--blue?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest--blue?logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing%20Library--blue?logo=testinglibrary&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS--blue?logo=tailwindcss&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint--blue?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier--blue?logo=prettier&logoColor=white)
![NSwag](https://img.shields.io/badge/NSwag--blue?logo=openapiinitiative&logoColor=white)
![dotnet-format](https://img.shields.io/badge/dotnet%20format--blue?logo=dotnet&logoColor=white)
![xUnit](https://img.shields.io/badge/xUnit--blue?logo=.net&logoColor=white)


## Formatting with dotnet-format

You can format the `JobHuntX.API` project using the `dotnet-format` command:

```bash
$ cd JobHuntX.API
$ dotnet tool run dotnet-format
```

## Generating API Types with NSwag

After modifying models, you can use `nswag` to automatically define API types for the frontend:

```bash
$ cd ./JobHuntX.API
$ dotnet nswag run nswag.json
```

## License
This project is provided under the [MIT License](./LICENSE).
