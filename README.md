<div align="center">
  <img alt="ConvertsIt Logo" height="150px" src="/apps/web/public/icon-180x180.png">
</div>

# ConvertsIt - Your Essential Online Toolkit for Text & Web Utilities

ConvertsIt is a **powerful, free online utility website** designed to **streamline your daily tasks** and **boost productivity**. We offer a growing suite of **web-based tools** for **text processing, content conversion**, and various essential digital needs. Our mission is to provide a **clean, fast, and user-friendly interface** that helps both **developers and content creators** get their work done efficiently.

## Our Online Tools

ConvertsIt is home to a growing collection of powerful and easy-to-use online utilities. Here's what you can find:

-   **Precise Word Counter:** Get instant and accurate word, character, and line counts for any text – perfect for writers, students, and professionals.
-   **Markdown to HTML Converter:** Seamlessly transform your Markdown into clean, ready-to-use HTML with a live preview, ideal for web content creation.
-   **And More Coming Soon:** We're continuously expanding our collection to include additional text converters, image utilities, and other essential web-based tools.

## Tech Stack

ConvertsIt is built on a modern and robust stack to ensure performance, reliability, and an excellent developer experience:

-   **TypeScript** - For type safety and improved developer experience
-   **Next.js** - Full-stack React framework for high-performance web applications
-   **TailwindCSS** - Utility-first CSS for rapid UI development and responsive design
-   **shadcn/ui** - Reusable UI components for a consistent and polished user interface
-   **Elysia** - Type-safe, high-performance framework for the backend API
-   **tRPC** - End-to-end type-safe APIs for seamless communication between frontend and backend
-   **Bun** - Fast JavaScript runtime environment
-   **Turborepo** - Optimized monorepo build system for efficient development across multiple packages
-   **Biome** - Powerful tool for code linting and formatting, ensuring code quality

## Getting Started

First, install the dependencies:

```bash
bun install
```

Then, run the development server:

```bash
bun dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application. The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
Convertsit/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Elysia, TRPC)
```

## Available Scripts

-   `bun dev`: Start all applications in development mode
-   `bun build`: Build all applications for production
-   `bun dev:web`: Start only the web application
-   `bun dev:server`: Start only the server
-   `bun check-types`: Check TypeScript types across all apps
-   `bun check`: Run Biome formatting and linting

## Acknowledgements

This project was bootstrapped with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack).

