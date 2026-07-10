import { useToast } from "@/context/ToastContext";
import {
  getTrackedEmailById,
  updateTrackedEmail,
  type TrackedEmail,
} from "@/data/mockTrackedEmails";
import { Button } from "@radix-ui/themes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Divide,
  RefreshCcw,
  Send,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
dayjs.extend(relativeTime);

const EmailDetail = () => {
  // const query = useUrlQuery();
  // const id = query.get("id");
  // const navigate = useNavigate();

  // const { response, data, error, isPending, sent_date, deadline } =
  //   useTrackedDetail(id!);

  // if (error) return <p>{error.message}</p>;
  // if (isPending) return <EmailDetailSkeleton />;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerToast } = useToast();
  const [email, setEmail] = useState<TrackedEmail | null>(null);

  useEffect(() => {
    if (id) {
      const found = getTrackedEmailById(id);
      if (found) {
        setEmail(found);
      } else {
        triggerToast("Tracked email thread not found", "info");
        navigate("/tracked");
      }
    }
  }, [id, navigate, triggerToast]);

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3525cd] " />
      </div>
    );
  }

  const totalRecipients = email.recipients.length;
  const respondedRecipients = email.recipients.filter((r) => r.responded);
  const pendingRecipients = email.recipients.filter((r) => !r.responded);
  const completionPercentage =
    totalRecipients > 0
      ? Math.round(respondedRecipients.length / totalRecipients) * 100
      : 0;

  // Actions
  const handleSendBulkReminder = () => {
    if (pendingRecipients.length == 0) {
      triggerToast("All recipients have already responded!", "info");
      return;
    }

    const updatedRecipients = email.recipients.map((r) => {
      if (!r.responded) {
        return { ...r, remindersSent: r.remindersSent + 1 };
      }

      return r;
    });

    const newLog = {
      id: `log-reminder-${Date.now()}`,
      type: "reminder" as const,
      description: `Bulk reminder sent to ${pendingRecipients.length} pending Recipients`,
      timestamp: new Date().toLocaleString(),
    };

    const updatedEmail: TrackedEmail = {
      ...email,
      recipients: updatedRecipients,
      activityLogs: [newLog, ...email.activityLogs],
    };

    updateTrackedEmail(updatedEmail);
    setEmail(updatedEmail);
    triggerToast(
      `Sent reminders to ${pendingRecipients.length} recipients!`,
      "success",
    );
  };

  const handleSendIndividualReminder = (recipientEmail: string) => {
    const updatedRecipients = email.recipients.map((r) => {
      if (r.email === recipientEmail) {
        return { ...r, remindersSent: r.remindersSent + 1 };
      }
      return r;
    });

    const recipient = email.recipients.find((r) => r.email === recipientEmail);
    const newLog = {
      id: `log-single-reminder-${Date.now()}`,
      type: "reminder" as const,
      description: `Reminder sent to ${recipient?.name || recipientEmail}`,
      timestamp: new Date().toLocaleString(),
    };

    const updatedEmail: TrackedEmail = {
      ...email,
      recipients: updatedRecipients,
      activityLogs: [newLog, ...email.activityLogs],
    };

    updateTrackedEmail(updatedEmail);
    setEmail(updatedEmail);
    triggerToast(
      `Reminder sent to ${recipient?.name || recipientEmail}!`,
      "success",
    );
  };

  const handleToggleRecipientResponded = (recipientEmail: string) => {
    const targetRecipient = email.recipients.find(
      (r) => r.email === recipientEmail,
    );

    if (!targetRecipient) return;

    const newStatus = !targetRecipient.responded;

    const updatedRecipients = email.recipients.map((r) => {
      if (r.email === recipientEmail) {
        return {
          ...r,
          responded: newStatus,
          respondedAt: newStatus ? new Date().toLocaleString() : undefined,
        };
      }
      return r;
    });

    const logAction = newStatus
      ? "Response logged from"
      : "Response removed for";

    const newLog = {
      id: `log-toggle-response-${Date.now()}`,
      type: (newStatus ? "reply" : "status_change") as any,
      description: `${logAction} ${targetRecipient.name} (${recipientEmail})`,
      timestamp: new Date().toLocaleString(),
    };

    const allDone = updatedRecipients.every((r) => r.responded);
    const updatedStatus = allDone ? "Completed" : "Pending";

    const updatedEmail: TrackedEmail = {
      ...email,
      recipients: updatedRecipients,
      status: updatedStatus,
      activityLogs: [newLog, ...email.activityLogs],
    };
    updateTrackedEmail(updatedEmail);
    setEmail(updatedEmail);
    triggerToast(
      newStatus
        ? `Logged response from ${targetRecipient.name}`
        : `Removed response log for ${targetRecipient.name}`,
      "success",
    );
  };

  const handleOverallStatus = (status: TrackedEmail["status"]) => {
    const newLog = {
      id: `log-status-${Date.now()}`,
      type: "status_change" as const,
      description: `Overall tracking status marked as ${status}`,
      timestamp: new Date().toLocaleString(),
    };

    const updatedEmail: TrackedEmail = {
      ...email,
      status,
      activityLogs: [newLog, ...email.activityLogs],
    };
    updateTrackedEmail(updatedEmail);
    setEmail(updatedEmail);
    triggerToast(`Email status updated to ${status}!`, "success");
  };

  const getStatusBadge = (status: TrackedEmail["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
            <CheckCircle2 size={13} className="stroke-[2.5]" />
            Completed
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]">
            <AlertTriangle size={13} className="stroke-[2.5]" />
            Overdue
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#eff4ff] text-[#3525cd] border border-[#c7c4d8]/30">
            <Clock size={13} className="stroke-[2.5]" />
            Awaiting Responses
          </span>
        );
    }
  };

  return (
    <div className="w-full text-left px-4 md:px-6 lg:px-8">
      {/* Back link and navigation */}
      <div className="mb-6">
        <Link
          to={"/tracked"}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#777587] hover:text-[#0b1c30] transition-colors font-sans cursor-pointer group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Tracked Emails
        </Link>
      </div>

      {/* main grid layout */}
      <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left side: Email Header and recipients */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8">
          {/* main email overview section */}
          <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 shadow-xs relative">
            {/* subject line and status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-[#777587] uppercase tracking-wider font-mono">
                  Tracked Thread
                </span>
                <h2 className="font-sans text-2xl font-black text-[#0b1c30] tracking-tight leading-tight">
                  {email.subject}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#777587] font-medium pt-1">
                  <span>
                    Sent on <strong>{email.sentDate}</strong>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full hidden bg-[#c7c4d8]/50 sm:inline" />
                  <span>
                    Deadline{" "}
                    <strong className="text-[#0b1c30]">{email.deadline}</strong>
                  </span>
                </div>
              </div>
              <div className="sm:text-right shrink-0">
                {getStatusBadge(email.status)}
              </div>
            </div>

            {/* quick action panel */}
            <div className="pt-6 border-t border-[#c7c4d8]/15 flex flex-wrap gap-3 items-center">
              <button
                onClick={handleSendBulkReminder}
                disabled={pendingRecipients.length == 0}
                className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 disabled:bg-[#f1f0f7] disabled:text-[#777587] disabled:cursor-not-allowed py-2 px-4 rounded-xl font-sans text-xs font-bold tracking-wide flex items-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <Send size={13} className="stroke-2" /> Send Follow-up Reminder
              </button>

              {email.status !== "Completed" ? (
                <button
                  onClick={() => handleOverallStatus("Completed")}
                  className="bg-emrald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200 py-2 px-4 rounded-xl font-sans text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Check size={14} className="stroke-2.5" />
                  Mark Completed
                </button>
              ) : (
                <button
                  onClick={() => handleOverallStatus("Pending")}
                  className="bg-amber-50 text-amber-700 hover:bg-amber-100/80 border border-amber-200 py-2 px-4 rounded-xl font-sans text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCcw size={12} className="stroke-2.5" /> Mark Awaiting
                </button>
              )}
            </div>
          </div>

          {/* recipient section */}
          <div className="space-y-4 text-left">
            <h3 className="font-sans text-sm font-bold text-[#0b1c30 tracking-tight">
              Recipient Matrix
            </h3>
            {/* Awaiting Response */}
            <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl overflow-hidden shadow-xs">
              <div className="px-5 py-3.5 bg-slate-50 border border-[#c7c4d8]/20 flex items-center justify-between">
                <span className="font-sans text-xs font-bold text-[#0b1c30]">
                  Awaiting Response ({pendingRecipients.length})
                </span>
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider font-mono bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Requires Attention
                </span>
              </div>

              {pendingRecipients.length === 0 ? (
                <div className="p-8 text-center text-[#777587] font-sans text-xs">
                  All Recipients have responded! No actions pending
                </div>
              ) : (
                <div className="divide-y divide-[#c7c4d8]/15">
                  {pendingRecipients.map((recipient) => (
                    <div
                      key={recipient.email}
                      className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50/20 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-0.5">
                          <User size={15} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-sans text-xs font-bold text-[#0b1c30]">
                            {recipient.name}
                          </p>
                          <p className="font-mono text-[10px] text-[#777587">
                            {recipient.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-end">
                        <div className="text-xs">
                          <span className="text-[#777587]">Reminders: </span>
                          <strong className="text-amber-700 font-bold">
                            {recipient.remindersSent}
                          </strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleSendIndividualReminder(recipient.email)
                            }
                            className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer font-sans whitespace-nowrap"
                          >
                            Send Reminder
                          </button>
                          <button
                            onClick={() =>
                              handleToggleRecipientResponded(recipient.email)
                            }
                            className="bg-white border border-[#c7c4d8]/30 hover:bg-[#f8f9ff] text-[#464555] text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer font-sans whitespace-nowrap"
                          >
                            Log Response
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* already responded */}
            {respondedRecipients.length > 0 && (
              <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-[#c7c4d8]/20 flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-[#777587] ">
                    Responded ({respondedRecipients.length})
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider font-mono bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                    Loop Closed
                  </span>
                </div>

                <div className="divide-y divide-[#c7c4d8]/15 bg-white">
                  {respondedRecipients.map((recipient) => (
                    <div
                      key={recipient.email}
                      className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50/20 transition-all opacity-85"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                          <Check size={14} className="stroke-2.5" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-sans text-xs font-bold text-[#777587] line-through">
                            {recipient.name}
                          </p>
                          <p className="font-mono text-[10px] text-[#777587]">
                            {recipient.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-end">
                        {recipient.respondedAt && (
                          <p className="font-sans text-xs text-emerald-600 font-semibold">
                            Responded on {recipient.respondedAt}
                          </p>
                        )}
                        <button
                          onClick={() =>
                            handleToggleRecipientResponded(recipient.email)
                          }
                          className="bg-white border border-[#c7c4d8]/30 hover:bg-[#ffebee] text-red-600 hover:text-red-700 hover:border-red-200 text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer font-sans whitespace-nowrap"
                        >
                          Undo Response
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side   */}
        <div>right side will be putted here</div>
      </div>
    </div>
  );
};

export default EmailDetail;
