"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import NavBar from "@/components/ui/NavBar";
import { getSession, signIn } from "next-auth/react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: "bot",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        signIn(undefined,{callbackUrl:"/chat"})
      }
    };
    checkSession();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentMessage }),
      });

      if (response.status === 429) {
        const { error } = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text:
              error || "You’re sending messages too fast. Please wait a bit.",
            sender: "bot",
          },
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botResponse = {
        id: messages.length + 2,
        text:
          data.response ||
          data.message ||
          "Sorry, I received an empty response.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error calling LLM API:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="px-3 sm:px-4 lg:px-8 xl:px-16 pt-4 sm:pt-6 pb-2">
        <NavBar />
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto
         [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb]:bg-gray-300
   px-3 sm:px-4 lg:px-8 xl:px-16 py-3 sm:py-4"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`relative max-w-[80%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-md transition-all duration-300 ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.sender === "bot" ? (
                <div className="prose prose-sm sm:prose-base prose-slate max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="text-gray-900 text-sm sm:text-base leading-relaxed mb-2 sm:mb-3 last:mb-0">
                          {children}
                        </p>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-gray-900 text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-gray-900 text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-gray-900 text-sm sm:text-base font-semibold mb-1 sm:mb-2">
                          {children}
                        </h3>
                      ),
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="bg-gray-200 text-gray-800 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-mono">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-gray-200 text-gray-800 p-2 sm:p-4 rounded text-xs sm:text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                            {children}
                          </code>
                        ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-200 p-2 sm:p-4 rounded overflow-x-auto mb-2 sm:mb-3">
                          {children}
                        </pre>
                      ),
                      ul: ({ children }) => (
                        <ul className="text-gray-900 text-sm sm:text-base list-disc ml-4 sm:ml-5 mb-2 sm:mb-3">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="text-gray-900 text-sm sm:text-base list-decimal ml-4 sm:ml-5 mb-2 sm:mb-3">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1 sm:mb-2">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 sm:border-l-4 border-gray-400 pl-3 sm:pl-4 italic text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
                          {children}
                        </blockquote>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-900">{children}</em>
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm sm:text-base break-words">{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 shadow-md">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <div
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-3 sm:px-4 lg:px-8 xl:px-16 py-3 sm:py-4 lg:py-6 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 sm:gap-3 bg-gray-900/80 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-gray-600/50 shadow-lg">
            <Textarea
              className="flex-1 resize-none min-h-[40px] sm:min-h-[48px] max-h-24 sm:max-h-32 bg-transparent text-white border-none focus:ring-0 focus:outline-none text-sm sm:text-base placeholder:text-gray-400 px-2 sm:px-3 py-2 sm:py-3"
              placeholder="Type your message..."
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || message.trim() === ""}
              className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
