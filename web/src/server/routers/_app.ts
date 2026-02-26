import { router } from "../trpc";
import { transactionsRouter } from "./transactions";
import { lookupsRouter } from "./lookups";
import { categoriesRouter } from "./categories";
import { accountsRouter } from "./accounts";

export const appRouter = router({
    transactions: transactionsRouter,
    lookups: lookupsRouter,
    categories: categoriesRouter,
    accounts: accountsRouter,
});

export type AppRouter = typeof appRouter;
