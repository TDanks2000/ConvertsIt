import "dotenv/config";
import { cors } from "@elysiajs/cors";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Elysia } from "elysia";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";

const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "",
			methods: ["GET", "POST", "OPTIONS"],
		}),
	)
	.all("/trpc/*", async (context) => {
		const res = await fetchRequestHandler({
			endpoint: "/trpc",
			router: appRouter,
			req: context.request,
			createContext: () => createContext({ context }),
		});
		return res;
	})
	.get("/", () => "OK")
	.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});
