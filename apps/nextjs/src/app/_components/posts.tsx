"use client";

import { useState } from "react";

export function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <form
      className="flex w-full max-w-2xl flex-col"
      onSubmit={async (e) => {
        e.preventDefault();
      }}
    >
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button
        type="submit"
        className="rounded bg-emerald-400 p-2 font-bold text-zinc-900"
      >
        Create
      </button>
    </form>
  );
}

export function PostList() {
  return <div className="flex w-full flex-col gap-4"></div>;
}

export function PostCard() {
  return (
    <div className="flex flex-row rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow"></div>
      <div>
        <button
          className="cursor-pointer text-sm font-bold uppercase text-emerald-400"
          onClick={async () => {
            console.log("Delete post");
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;

  return (
    <div className="flex flex-row rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div
        className={`mr-2 h-16 w-16 self-center rounded ${
          pulse && "animate-pulse"
        }`}
      />
      <div className="flex-grow">
        <h2
          className={`w-1/4 rounded bg-emerald-400 text-2xl font-bold ${
            pulse && "animate-pulse"
          }`}
        >
          &nbsp;
        </h2>
        <p
          className={`mt-2 w-1/3 rounded bg-current text-sm ${
            pulse && "animate-pulse"
          }`}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
