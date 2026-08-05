import React from "react";

export interface ConversationErrorStateProps {
  title: string;
  errorMessage: string;
  onRetry: () => void;
  isRetrying: boolean;
}

const ConversationError = ({
  title = "Unable to load conversation",
  errorMessage = "We couldn't fetch the responses for this email. Please check your connection and try again.",
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div>
      <div></div>

      <div></div>

      {onRetry && <button></button>}
    </div>
  );
};

export default ConversationError;
