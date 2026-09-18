import React from "react";
import { useFormStatus } from "react-dom";

export default function Button({
  before,
  after,
  size,
}: {
  before: string;
  after: string;
  size: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${size} flex justify-center items-center rounded-global-button-radius bg-global-button-primary px-4 py-2 text-global-button-text text-sm font-medium shadow-sm hover:bg-global-button-hover active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {pending ? before : after}
    </button>
  );
}
