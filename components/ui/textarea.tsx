import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        `
          w-full min-h-16
          rounded-lg
          px-4 py-3
          bg-gray-800/85
          border border-gray-700
          text-gray-100
          placeholder:text-gray-400
          shadow-sm
          transition-all duration-200
          outline-none
          focus:border-blue-500
          focus:ring-2 focus:ring-blue-500/30
          hover:border-gray-500
          disabled:cursor-not-allowed
          disabled:opacity-60
          aria-invalid:border-red-500
          aria-invalid:ring-red-500/20
        `,
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
