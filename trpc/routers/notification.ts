import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { protectedProcedure, router } from "../init";
import { db } from "@/db";
import { notifications } from "@/db/schema";

export const notificationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, ctx.session.user.id))
      .orderBy(desc(notifications.createdAt));
  }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const rows = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, ctx.session.user.id),
          eq(notifications.isRead, false)
        )
      );
    return rows.length;
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.session.user.id)
          )
        );
      return { success: true };
    }),

      markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, ctx.session.user.id));
    return { success: true };
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await db
        .delete(notifications)
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.session.user.id)
          )
        );
      return { success: true };
    }),
});