import type { ThreadMessage } from "@/data/mockTrackedEmails";
import { MessageSquare } from "lucide-react";
import ConversationMessage from "./ConversationMessage";

interface ConversationSectionProps {
  messages?: ThreadMessage[];
  subject: string;
  onAddMockReply?: (
    senderName: string,
    senderEmail: string,
    content: string,
  ) => void;
}

const ConversationSection = ({ messages = [] }: ConversationSectionProps) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-[#3525cd]" />
          <h3 className="font-sans text-sm font-bold text-slate-900 tracking-tight">
            Gmail Thread Conversation
          </h3>
          <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
            {messages.length} message{messages.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* message stack */}
      {messages.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-sans">
          No conversation messages captured in this thread yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <ConversationMessage key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationSection;
