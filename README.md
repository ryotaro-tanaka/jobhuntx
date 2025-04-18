![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?logo=typescript)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-blue?logo=dotnet)
![Docker](https://img.shields.io/badge/Docker-blue?logo=docker)
![Vite](https://img.shields.io/badge/Vite-5.4.14-blue?logo=vite)
![Vitest](https://img.shields.io/badge/Vitest-1.6.1-blue?logo=vitest)
![Testing Library](https://img.shields.io/badge/Testing%20Library-14.3.1-blue?logo=testinglibrary)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-blue?logo=tailwindcss)
![ESLint](https://img.shields.io/badge/ESLint-8.57.1-blue?logo=eslint)
![Prettier](https://img.shields.io/badge/Prettier-3.1.1-blue?logo=prettier)

# JobHuntX

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

## License
This project is provided under the [MIT License](./LICENSE).
