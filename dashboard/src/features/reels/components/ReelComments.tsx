import {
  useState,
} from "react";

import {
  Send,
  X,
} from "lucide-react";

import {
  useReelComments,
} from "../hooks/useReelComments";

import {
  useCreateReelComment,
} from "../hooks/useCreateReelComment";

interface Props {
  reelId: string;
  open: boolean;
  onClose: () => void;
}

export default function ReelComments({
  reelId,
  open,
  onClose,
}: Props) {
  const [text, setText] =
    useState("");

  const comments =
    useReelComments(
      reelId,
      open
    );

  const createComment =
    useCreateReelComment(
      reelId
    );

  if (!open) {
    return null;
  }

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const value =
      text.trim();

    if (!value) {
      return;
    }

    createComment.mutate(
      value,
      {
        onSuccess: () => {
          setText("");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="flex h-[75vh] w-full max-w-lg flex-col rounded-t-3xl bg-white sm:rounded-3xl">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-bold">
            Izohlar
          </h2>

          <button
            type="button"
            onClick={() => {
  setText("");
  onClose();
}}
          >
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {comments.isLoading ? (
            <p className="text-center text-sm text-slate-500">
              Izohlar yuklanmoqda...
            </p>
          ) : comments.data?.length ? (
            <div className="space-y-5">
              {comments.data.map(
                (comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3"
                  >
                    <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-slate-200">
                      {comment.user
                        .avatarUrl && (
                        <img
                          src={
                            comment.user
                              .avatarUrl
                          }
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold">
                        {
                          comment.user
                            .fullName
                        }
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-center text-sm text-slate-500">
              Hozircha izohlar yo'q.
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t p-4"
        >
          <input
            value={text}
            onChange={(event) =>
              setText(
                event.target.value
              )
            }
            placeholder="Izoh yozing..."
            maxLength={1000}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={
              !text.trim() ||
              createComment.isPending
            }
            className="rounded-xl bg-blue-600 px-4 text-white disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}