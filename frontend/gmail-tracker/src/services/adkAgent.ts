import type { AgentResponse, ChatMessage } from "@/pages/Agent";
import { adkApi, agentApi } from "@/services/adkApi";
import type { TrackedEmailB } from "./trackedEmail";
import type { SentEmail } from "@/type";

const ADK_APP_NAME = "echomail_agent";

type ADKEvent = {
  content?: {
    role?: "user" | "model";
    parts?: {
      text?: string;
      functionResponse?: {
        name?: string;
        response?: {
          result?: unknown;
        };
      };
    }[];
  };

  errorCode?: string;
  errorMessage?: string;
};

export const getSession = async (sessionId: string, userId: number) => {
  const response = await adkApi.get(
    `/apps/${ADK_APP_NAME}/users/${userId}/sessions/${sessionId}`,
  );

  return response.data;
};

export const createSession = async (sessionId: string, userId: number) => {
  const response = await adkApi.post(
    `/apps/${ADK_APP_NAME}/users/${userId}/sessions`,
    {
      sessionId,
      state: {
        user_id: userId,
        sent_email_context: null,
        tracked_emails_context: null,
        selected_tracked_email_context: null,
        pending_follow_up_context: null,
      },
      events: [],
    },
  );

  return response.data;
};

export const sendMessage = async (
  sessionId: string,
  message: string,
  userId: number,
) => {
  const response = await agentApi.post("/agent/chat", {
    session_id: sessionId,
    message,
    user_id: userId,
  });

  return response.data;
};

export const extractAgentResponse = (
  response: AgentResponse,
): AgentResponse => {
  return response;
};

// message persistent using session object
export const extractChatMessages = (events: ADKEvent[]): ChatMessage[] => {
  const messages: ChatMessage[] = [];

  let toolName: string | null = null;
  let toolData: unknown[] = [];

  events.forEach((event, index) => {
    const parts = event.content?.parts ?? [];

    for (const part of parts) {
      // Tool response
      const functionResponse = part.functionResponse;

      if (functionResponse) {
        toolName = functionResponse.name ?? null;

        const response = functionResponse.response;
        const result = response?.result;

        if (Array.isArray(result)) {
          toolData = result;
        }
      }

      // Text message
      if (part.text) {
        const text = part.text;

        if (event.content?.role === "user") {
          messages.push({
            id: `${index}`,
            role: "user",
            content: text,
            status: "complete",
          });
        }

        if (event.content?.role === "model") {
          let agentResponse: AgentResponse;

          if (toolName === "search_my_sent_email") {
            agentResponse = {
              type: "sent_email_search",
              content: text,
              data: toolData as SentEmail[],
            };
          } else if (toolName === "get_tracked_emails") {
            agentResponse = {
              type: "tracked_emails",
              content: text,
              data: toolData as TrackedEmailB[],
            };
          } else {
            agentResponse = {
              type: "text",
              content: text,
              data: [],
            };
          }

          messages.push({
            id: `${index}`,
            role: "model",
            content: text,
            status: "complete",
            agentResponse,
          });

          // Reset after completing this assistant response
          toolName = null;
          toolData = [];
        }
      }
    }
  });

  return messages;
};
