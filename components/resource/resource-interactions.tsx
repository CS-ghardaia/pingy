"use client";

import { useActionState, useEffect, useState } from "react";
import { Flag, Heart, MessageCircle, Pencil, Star, Trash2 } from "lucide-react";

import {
  addCommentAction,
  deleteCommentAction,
  rateResourceAction,
  recordResourceViewAction,
  reportResourceAction,
  toggleFavoriteAction,
  updateCommentAction,
} from "@/lib/student/actions";
import { initialActionState } from "@/lib/student/action-state";
import type { CommentSummary, LookupOption } from "@/lib/student/types";
import { cn } from "@/lib/utils";

export function ResourceViewRecorder({ resourceId }: { readonly resourceId: string }) {
  useEffect(() => {
    const key = `pingy:view:${resourceId}`;
    if (window.sessionStorage.getItem(key)) {
      return;
    }

    window.sessionStorage.setItem(key, "1");
    void recordResourceViewAction(resourceId);
  }, [resourceId]);

  return null;
}

export function FavoriteButton({
  resourceId,
  isFavorite,
}: {
  readonly resourceId: string;
  readonly isFavorite: boolean;
}) {
  return (
    <form action={toggleFavoriteAction}>
      <input type="hidden" name="resourceId" value={resourceId} />
      <input type="hidden" name="next" value={isFavorite ? "remove" : "add"} />
      <button
        type="submit"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-[color:var(--primary-black)] px-4 py-2 font-bold transition hover:bg-secondary hover:text-secondary-foreground"
        aria-label={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      >
        <Heart
          className={cn("size-5", isFavorite && "fill-primary text-primary")}
          aria-hidden="true"
        />
        {isFavorite ? "في المفضلة" : "مفضلة"}
      </button>
    </form>
  );
}

export function RatingStars({
  resourceId,
  value,
}: {
  readonly resourceId: string;
  readonly value: number | null;
}) {
  const [state, formAction, pending] = useActionState(
    rateResourceAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="card-surface p-5">
      <input type="hidden" name="resourceId" value={resourceId} />
      <p className="text-sm font-bold text-muted-foreground">قيّم المورد</p>
      <div className="mt-3 flex flex-row-reverse justify-end gap-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="submit"
            name="rating"
            value={rating}
            disabled={pending}
            className="flex size-11 items-center justify-center rounded-lg text-primary transition hover:bg-accent"
            aria-label={`تقييم ${rating} من 5`}
          >
            <Star
              className={cn("size-6", value && rating <= value && "fill-primary")}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      {state.message ? (
        <p
          className={cn(
            "mt-2 text-sm font-bold",
            state.status === "error"
              ? "text-[color:var(--on-error-container)]"
              : "text-[color:var(--on-success-container)]",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function CommentThread({
  resourceId,
  comments,
  currentUserId,
}: {
  readonly resourceId: string;
  readonly comments: readonly CommentSummary[];
  readonly currentUserId: string;
}) {
  const [state, formAction, pending] = useActionState(
    addCommentAction,
    initialActionState,
  );
  const roots = comments.filter((comment) => !comment.parentCommentId);
  const replies = comments.filter((comment) => comment.parentCommentId);

  return (
    <section className="card-surface p-6">
      <h2 className="flex items-center gap-2 text-xl font-extrabold">
        <MessageCircle className="size-5" aria-hidden="true" />
        التعليقات
      </h2>
      <form action={formAction} className="mt-5 space-y-3">
        <input type="hidden" name="resourceId" value={resourceId} />
        <label htmlFor="comment" className="sr-only">
          اكتب تعليقاً
        </label>
        <textarea
          id="comment"
          name="content"
          minLength={2}
          required
          className="min-h-30 w-full rounded-lg border border-input bg-background px-4 py-3 text-base leading-7 focus:border-primary focus:ring-[3px] focus:ring-primary/20"
          placeholder="شارك ملاحظة مفيدة حول المورد..."
        />
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground"
        >
          نشر التعليق
        </button>
        {state.message ? (
          <p className="text-sm font-bold text-muted-foreground">{state.message}</p>
        ) : null}
      </form>
      <div className="mt-6 space-y-4">
        {roots.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={replies.filter((reply) => reply.parentCommentId === comment.id)}
            resourceId={resourceId}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  replies,
  resourceId,
  currentUserId,
}: {
  readonly comment: CommentSummary;
  readonly replies: readonly CommentSummary[];
  readonly resourceId: string;
  readonly currentUserId: string;
}) {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [replyState, replyAction] = useActionState(addCommentAction, initialActionState);
  const [editState, editAction] = useActionState(updateCommentAction, initialActionState);
  const isOwner = comment.userId === currentUserId;

  return (
    <article className="rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-extrabold">{comment.authorName}</p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {new Date(comment.createdAt).toLocaleString("ar-DZ")}
            {comment.isEdited ? " · تم التعديل" : ""}
          </p>
        </div>
        {isOwner ? (
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="flex size-11 items-center justify-center rounded-lg hover:bg-muted"
              aria-label="تعديل التعليق"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </button>
            <form action={deleteCommentAction}>
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="resourceId" value={resourceId} />
              <button
                type="submit"
                className="flex size-11 items-center justify-center rounded-lg hover:bg-muted"
                aria-label="حذف التعليق"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        ) : null}
      </div>
      {editing ? (
        <form action={editAction} className="mt-3 space-y-2">
          <input type="hidden" name="commentId" value={comment.id} />
          <input type="hidden" name="resourceId" value={resourceId} />
          <textarea
            name="content"
            defaultValue={comment.content}
            className="min-h-24 w-full rounded-lg border border-input px-4 py-3"
          />
          <button className="min-h-11 rounded-lg bg-secondary px-4 py-2 font-bold text-secondary-foreground">
            حفظ
          </button>
          {editState.message ? <p className="text-sm">{editState.message}</p> : null}
        </form>
      ) : (
        <p className="mt-3 leading-7 text-muted-foreground">{comment.content}</p>
      )}
      <button
        type="button"
        onClick={() => setReplying((value) => !value)}
        className="mt-3 min-h-11 rounded-lg px-3 py-2 text-sm font-bold hover:bg-muted"
      >
        رد
      </button>
      {replying ? (
        <form action={replyAction} className="mt-3 space-y-2">
          <input type="hidden" name="resourceId" value={resourceId} />
          <input type="hidden" name="parentCommentId" value={comment.id} />
          <textarea
            name="content"
            required
            className="min-h-24 w-full rounded-lg border border-input px-4 py-3"
            placeholder="اكتب رداً..."
          />
          <button className="min-h-11 rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground">
            نشر الرد
          </button>
          {replyState.message ? <p className="text-sm">{replyState.message}</p> : null}
        </form>
      ) : null}
      {replies.length > 0 ? (
        <div className="mt-4 space-y-3 border-r-2 border-border pr-4">
          {replies.map((reply) => (
            <p key={reply.id} className="rounded-lg bg-muted p-3 text-sm leading-6">
              <span className="font-bold">{reply.authorName}: </span>
              {reply.content}
            </p>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function ReportDialog({
  resourceId,
  reasons,
}: {
  readonly resourceId: string;
  readonly reasons: readonly LookupOption[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    reportResourceAction,
    initialActionState,
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 font-bold hover:bg-muted"
      >
        <Flag className="size-5" aria-hidden="true" />
        إبلاغ
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(17,17,17,0.5)] p-4 backdrop-blur-sm">
          <form action={formAction} className="w-full max-w-xl rounded-lg bg-background p-8 shadow-[0_24px_48px_rgba(17,17,17,0.12)]">
            <input type="hidden" name="resourceId" value={resourceId} />
            <h2 className="text-2xl font-extrabold">إبلاغ عن المورد</h2>
            <label htmlFor="reason" className="mt-5 block text-sm font-bold text-muted-foreground">
              سبب البلاغ
            </label>
            <select
              id="reason"
              name="reason"
              required
              className="mt-2 h-12 w-full rounded-lg border border-input bg-background px-4"
            >
              <option value="">اختر السبب</option>
              {reasons.map((reason) => (
                <option key={reason.code} value={reason.code}>
                  {reason.nameAr}
                </option>
              ))}
            </select>
            <label htmlFor="description" className="mt-4 block text-sm font-bold text-muted-foreground">
              تفاصيل إضافية
            </label>
            <textarea
              id="description"
              name="description"
              className="mt-2 min-h-28 w-full rounded-lg border border-input bg-background px-4 py-3"
            />
            {state.message ? <p className="mt-3 text-sm font-bold">{state.message}</p> : null}
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                disabled={pending}
                className="min-h-11 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground"
              >
                إرسال البلاغ
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-11 rounded-lg px-6 py-3 font-bold hover:bg-muted"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
