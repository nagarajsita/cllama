import { Playfair_Display } from "next/font/google";
import { Button } from "@/components/ui/button";
import { PlaceholdersDisplay } from "@/components/ui/text-input";
import { signIn } from "@/auth";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <main className="flex flex-col h-full items-center justify-center">
      <h1 className="text-white text-2xl md:text-5xl font-bold text-shadow-xs text-shadow-green-200">
        Chat Smarter with{" "}
        <span className={playfair.className} style={{ fontStyle: "italic" }}>
          <span className="text-green-500">A</span>chat
        </span>
      </h1>
      <h3 className="mt-8 text-gray-400 text-sm md:text-lg md:w-1/2 font-semibold text-center">
        Your intelligent AI chat companion—ready to answer questions, brainstorm
        ideas, and help you get things done.
      </h3>
      <div className="flex flex-col gap-3 mt-8 w-full justify-center items-center">
        <PlaceholdersDisplay />
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/chat" });
          }}
        >
          <Button className="bg-white font-bold" type="submit">
            Start chatting
          </Button>
        </form>
      </div>
    </main>
  );
}
