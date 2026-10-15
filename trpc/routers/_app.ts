import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { db } from '@/index';
import { usersTable } from '@/db/schema';

 
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async (opts) => {
        const users = await db.select().from(usersTable);
      return {
        greeting: `hello ${opts.input.text}`,
        users: users,
      };
    }),
    
});
 
// export type definition of API
export type AppRouter = typeof appRouter;   