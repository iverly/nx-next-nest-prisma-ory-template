# nx-next-nest-prisma-ory-template

## Overview

This repository contains a template for a full-stack application utilizing a powerful tech stack: NX workspace, NestJS, NextJS, Prisma, and Ory. This combination offers a scalable, modern architecture suitable for complex applications.

## Features

- **NX Workspace**: Efficient monorepo management for sharing code and tools.
- **NestJS**: A versatile, progressive Node.js framework for building efficient and scalable server-side applications.
- **NextJS**: A React-based framework for building user-friendly and performant web applications.
- **Prisma**: Next-generation ORM for Node.js and TypeScript, simplifying database workflows.
- **Ory**: Robust security layer offering identity management, authorization, and authentication.

## Getting Started

### Prerequisites

- Node.js (version 18)
- pnpm
- Docker

### Installation

1. **Clone the Template Repository**

   You can perform this step through the GitHub UI.

2. **Clone your Forked Repository**

   ```bash
   git clone https://github.com/your-name/your-repo.git

   ```

3. **Install Dependencies**

   ```bash
   pnpm install
   ```

4. **Environment Configuration**

   Set up your `.env` file based on the provided `.env.example`.

5. **Startup the Stack**

   ```bash
   pnpm dev:docker:up
   ```

6. **Run Migrations**

   ```bash
   pnpm migrate:deploy
   ```

### Running the Application

- **Development Mode**

  ```bash
  pnpm dev:api
  # or
  pnpm dev:www
  ```

- **Production Build**

  ```bash
  pnpm build:api
  # or
  pnpm build:www
  ```

## Documentation

- [NX Workspace](https://nx.dev/)
- [NestJS Documentation](https://nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Ory Documentation](https://www.ory.sh/docs/)

## Contributing

Contributions are welcome. Please follow the standard Git workflow - fork, branch, and pull request.

## License

This project is licensed under the Apache 2.0 - see the `LICENSE` file for details.
