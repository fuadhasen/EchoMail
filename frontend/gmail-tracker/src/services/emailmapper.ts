import type { SentEmail, SentEmailRecipient, SentEmailSender } from "@/type";
import type { SentEmailB } from "./email";

/**
 * Parses string like:
 * "Fuad Hassen <fuad@gmail.com>"
 * into:
 * { name: "Fuad Hassen", email: "fuad@gmail.com" }
 */

function parsePerson(value: string) {
  const match = value.match(/^(.*?)<(.+)>$/);

  if (!match) {
    const email = value.replace(/"/g, "");

    return {
      name: email,
      email,
    };
  }

  return {
    name: match[1].replace(/"/g, "").trim(),
    email: match[2].trim(),
  };
}

export function mapSentEmail(email: SentEmailB): SentEmail {
  const sender = parsePerson(email.sender);

  const recipients: SentEmailRecipient[] = email.recipients.map((r) =>
    parsePerson(r),
  );

  const senderData: SentEmailSender = {
    name: sender.name,
    email: sender.email,
  };

  return {
    id: email.id,
    thread_id: email.thread_id,
    subject: email.subject,

    sender: senderData,
    recipients,

    snippet: email.snippet,
    sentDate: email.sentdate,
  };
}
