import { router } from "../trpc";
import { transactionsRouter } from "./transactions";
import { lookupsRouter } from "./lookups";
import { categoriesRouter } from "./categories";
import { accountsRouter } from "./accounts";
import { authRouter } from "./auth";
import { recurringRouter } from "./recurring";

export const appRouter = router({
    transactions: transactionsRouter,
    lookups: lookupsRouter,
    categories: categoriesRouter,
    accounts: accountsRouter,
    auth: authRouter,
    recurring: recurringRouter,
});

export type AppRouter = typeof appRouter;
