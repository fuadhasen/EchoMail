import SessionLoadingSkeleton from "@/components/skeletons/SessionLoadingSkeleton";
import useAuth from "@/hooks/useAuth";
import {
  createSession,
  extractChatMessages,
  getSession,
  sendMessage,
} from "@/services/adkAgent";
import type { TrackedEmailB } from "@/services/trackedEmail";
import type { SentEmail } from "@/type";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Bot,
  ChevronRight,
  Clock,
  MailCheck,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export type AgentResponse =
  | {
      type: "sent_email_search";
      content: string;
      data: SentEmail[];
    }
  | {
      type: "tracked_emails";
      content: string;
      data: TrackedEmailB[];
    }
  | {
      type: "text";
      content: string;
      data: [];
    };

export type ChatMessage = {
  id: string;
  role: "model" | "user";
  content: string;
  timestamp?: string;
  status?: "pending" | "complete" | "error";

  agentResponse?: AgentResponse;
};

interface Suggestion {
  id: string;
  title: string;
  desc: string;
  prompt: string;
  icon: typeof Search;
  tag: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    id: "find-email",
    title: "Find an email",
    desc: "Search threads across your outbox by subject or recipient",
    prompt: "Find an email about ",
    icon: Search,
    tag: "Search",
  },
  {
    id: "check-replies",
    title: "Did anyone reply to my emails?",
    desc: "Check recent recipient responses and status updates",
    prompt: "Did anyone reply to my tracked emails recently?",
    icon: MailCheck,
    tag: "Replies",
  },
  {
    id: "follow-up",
    title: "Find emails I need to follow up on",
    desc: "Review approaching deadlines and pending communications",
    prompt: "Find emails I need to follow up on today",
    icon: Clock,
    tag: "Follow-up",
  },
];

const CAPABILITIES = [
  {
    id: "understand",
    label: "Understand",
    sublabel: "Request & context",
    icon: Sparkles,
  },
  {
    id: "find",
    label: "Find",
    sublabel: "Emails & replies",
    icon: Search,
  },
  {
    id: "analyze",
    label: "Analyze",
    sublabel: "Deadlines & attention",
    icon: Clock,
  },
  {
    id: "assist",
    label: "Assist",
    sublabel: "Drafts & guidance",
    icon: MailCheck,
  },
  {
    id: "act",
    label: "Act",
    sublabel: "Action on request",
    icon: Send,
  },
];

const Agent = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessionLoading, setSessionLoading] = useState(true);

  const [sessionId, setSessionId] = useState(() => {
    const existingSession = localStorage.getItem("echomail-session-id");

    if (existingSession) {
      return existingSession;
    }

    const newSessionId = crypto.randomUUID();
    localStorage.setItem("echomail-session-id", newSessionId);

    return newSessionId;
  });

  // session initialization
  useEffect(() => {
    if (!user) {
      return;
    }

    const initializeSession = async () => {
      try {
        const session = await getSession(sessionId, user.id);
        const restoredMessages = extractChatMessages(session.events);

        setMessages(restoredMessages);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          await createSession(sessionId, user.id);
        } else {
          console.error("Failed to initialize session:", error);
        }
      } finally {
        setSessionLoading(false);
      }
    };

    initializeSession();
  }, [sessionId, user]);

  const sendMessageMutation = useMutation({
    mutationFn: async ({
      sessionId,
      message,
    }: {
      sessionId: string;
      message: string;
    }) => {
      return sendMessage(sessionId, message, user!.id);
    },

    onSuccess: (data) => {
      console.log("ADK response:", data);

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "model",
        content: data.content,
        timestamp: "",

        agentResponse: data,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    },

    onError: (error) => {
      let errorMessage = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error) && error.response?.status === 503) {
        errorMessage =
          "The AI service is temporarily unavailable. Please try again in a moment.";
      }

      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "model",
        content: errorMessage,
        timestamp: "Just now",
        status: "error",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    },
  });

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendMessageMutation.isPending]);

  const handleSelectSuggestion = (promptText: string) => {
    setInputValue(promptText);
    inputRef.current?.focus();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    sendMessageMutation.mutate({
      sessionId,
      message: userMessage.content,
    });
  };

  const handleResetChat = () => {
    // generate new session
    const newSessionId = crypto.randomUUID();

    localStorage.setItem("echomail-session-id", newSessionId);
    setSessionId(newSessionId);

    setMessages([]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2.5rem)] md:h-[calc(100vh-4rem)] max-w-5xl ml-10 md:ml-60  text-left">
      {/* 1. Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 md:pb-5 border-b border-slate-200/80 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] border border-[#3525cd]/20 flex items-center justify-center text-[#3525cd] shadow-2xs shrink-0">
            <Bot size={20} className="stroke-2.2" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                AI Agent
              </h1>
            </div>
            <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mt-0.5">
              Understand your emails. Find what matters. Take action.
            </p>
          </div>
        </div>

        {/* Status / Actions */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleResetChat}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 px-3 py-1.5 rounded-xl font-sans text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RotateCcw size={12} />
              <span>New Chat</span>
            </button>
          )}
          <div className="flex items-center gap-2 bg-white border border-slate-200/80 py-1.5 px-3 rounded-xl text-xs font-mono text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">Agent Ready</span>
          </div>
        </div>
      </header>

      {/* 3. Main Chat Area */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none py-4 flex flex-col justify-between">
        {sessionLoading ? (
          <SessionLoadingSkeleton />
        ) : messages.length === 0 ? (
          <>
            {/* 2. Capability Workflow: UNDERSTAND -> FIND -> ANALYZE -> ASSIST -> ACT */}
            <section
              aria-label="Workflow Capabilities"
              className="mt-3 shrink-0 bg-white border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-0.5">
                {CAPABILITIES.map((cap, index) => {
                  const Icon = cap.icon;
                  return (
                    <React.Fragment key={cap.id}>
                      <div className="flex items-center gap-2 px-2 py-1 rounded-xl shrink-0 group hover:bg-slate-50 transition-colors">
                        <div className="w-6 h-6 rounded-lg bg-[#eff4ff] border border-[#3525cd]/15 flex items-center justify-center text-[#3525cd] shrink-0">
                          <Icon size={12} className="stroke-2" />
                        </div>
                        <div className="text-left">
                          <div className="font-sans text-xs font-bold text-slate-900 group-hover:text-[#3525cd] transition-colors">
                            {cap.label}
                          </div>
                          <p className="text-[10px] text-slate-500 font-sans hidden md:block whitespace-nowrap">
                            {cap.sublabel}
                          </p>
                        </div>
                      </div>
                      {index < CAPABILITIES.length - 1 && (
                        <ChevronRight
                          size={14}
                          className="text-slate-300 shrink-0 mx-0.5"
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </section>
            {/* /* Empty State - Clean, focused workspace */}
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8 sm:py-12 max-w-xl mx-auto w-full px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[#3525cd]/20 shadow-[0_4px_20px_-4px_rgba(53,37,205,0.12)] flex items-center justify-center text-[#3525cd] mb-4 transition-transform duration-200 hover:scale-105">
                <Sparkles size={28} className="stroke-[1.8]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-sans">
                Email Intelligence Workspace
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed mt-2 font-sans">
                Ask naturally to check thread responses, review upcoming
                deadlines, locate outbox messages, or prepare follow-up drafts.
              </p>
              {/* Subtle inline suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6 w-full">
                {SUGGESTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(item.prompt)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-[#3525cd]/30 text-xs text-slate-600 hover:text-slate-900 shadow-2xs transition-all cursor-pointer group"
                  >
                    <span className="text-slate-400 group-hover:text-[#3525cd] transition-colors">
                      ↳
                    </span>
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Conversation Messages List */
          <div className="space-y-5 py-2">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const isError = msg.status === "error";

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 sm:gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#eff4ff] border border-[#3525cd]/20 flex items-center justify-center text-[#3525cd] shrink-0 mt-0.5 shadow-2xs">
                      <Bot size={16} className="stroke-2" />
                    </div>
                  )}

                  {isUser ? (
                    <div className="w-fit max-w-[85%] sm:max-w-lg rounded-2xl rounded-tr-xs px-4 py-2.5 text-base font-mono leading-relaxed shadow-xs bg-slate-900 text-white">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ) : (
                    <div
                      className={`w-full max-w-[90%] sm:max-w-2xl min-w-0 rounded-2xl rounded-tl-xs px-4 py-3.5 sm:p-5 text-sm font-sans leading-relaxed shadow-2xs ${
                        isError
                          ? "bg-red-50/90 border border-red-200 text-red-800"
                          : "bg-white border border-slate-200/80 text-slate-900"
                      }`}
                    >
                      {msg.status !== "error" ? (
                        <div className="min-w-0 max-w-full text-slate-800 text-sm sm:text-base font-mono wrap-break-words">
                          <ReactMarkdown
                            components={{
                              pre: ({ children }) => (
                                <pre className="max-w-full whitespace-pre-wrap wrap-break-word overflow-hidden">
                                  {children}
                                </pre>
                              ),
                              code: ({ children }) => (
                                <code className="whitespace-pre-wrap wrap-break-word">
                                  {children}
                                </code>
                              ),
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm text-red-700">
                          {msg.content}
                        </p>
                      )}
                    </div>
                  )}

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading typing indicator */}
            {sendMessageMutation.isPending && (
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#eff4ff] border border-[#3525cd]/20 flex items-center justify-center text-[#3525cd] shrink-0 mt-0.5 shadow-2xs">
                  <Bot size={16} className="stroke-2" />
                </div>

                <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500 font-sans">
                      Analyzing email workflow...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 4 & 5. Sticky Chat Input Bar with Context Awareness & Hint */}
      <div className="shrink-0 pt-2 pb-1 bg-linear-to-t from-[#f8f9ff] via-[#f8f9ff] to-transparent sticky bottom-0 z-10 space-y-2">
        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)] p-2 sm:p-2.5 flex items-center gap-2 focus-within:border-[#3525cd] focus-within:ring-2 focus-within:ring-[#3525cd]/15 transition-all"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 shrink-0 ml-1">
            <Sparkles size={16} className="text-[#3525cd]" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about your emails ..."
            className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-sans px-2 min-w-0"
          />

          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue("")}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Clear input"
            >
              <X size={14} />
            </button>
          )}

          <button
            type="submit"
            disabled={!inputValue.trim() || sendMessageMutation.isPending}
            className="bg-[#3525cd] hover:bg-[#281ca8] disabled:opacity-40 disabled:hover:bg-[#3525cd] text-white p-2.5 rounded-xl transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed shrink-0 flex items-center justify-center"
            aria-label="Send message"
          >
            <Send size={15} className="stroke-2" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Agent;
