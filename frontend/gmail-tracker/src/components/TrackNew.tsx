import { useToast } from "@/context/ToastContext";
import {
  addTrackedEmail,
  getSentEmails,
  type ActivityLog,
  type Recipient,
  type SentEmail,
  type TrackedEmail,
} from "@/data/mockTrackedEmails";
import {
  ArrowLeft,
  Check,
  CheckCircle,
  CheckCircle2,
  Divide,
  Mail,
  Search,
} from "lucide-react";
import React from "react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

const TrackNew = () => {
  const navigate = useNavigate();
  const { triggerToast } = useToast();

  // workflow step state (1 to 4)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Data state
  const sentEmails = useMemo(() => getSentEmails(), []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);

  // step 2: Recipient selection
  const [selectedRecipientEmails, setSelectedRecipientEmails] = useState<
    string[]
  >([]);

  // step 3:Deadline
  const [deadlineDate, setDeadlineDate] = useState(() => {
    // default to 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  });
  const [deadlineTime, setDeadlineTime] = useState("17:00"); //5 pm

  const filteredSentEmails = useMemo(() => {
    return sentEmails.filter(
      (email) =>
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [sentEmails, searchTerm]);

  // step 1: select Emails
  const handleSelectEmail = (email: SentEmail) => {
    setSelectedEmail(email);
    // auto select all recipients by default
    setSelectedRecipientEmails(email.recipients.map((r) => r.email));
    setStep(2);
  };

  // step 2: Toggle a recipient
  const handleToggleRecipient = (emailStr: string) => {
    setSelectedRecipientEmails((prev) => {
      // if its exist remove it , if not add it
      if (prev.includes(emailStr)) {
        return prev.filter((e) => e !== emailStr);
      } else {
        return [...prev, emailStr];
      }
    });
  };

  const handleSelectAllRecipients = () => {
    if (!selectedEmail) return;
    if (selectedRecipientEmails.length === selectedEmail.recipients.length) {
      // clear all, deselect all
      setSelectedRecipientEmails([]);
    } else {
      setSelectedRecipientEmails(selectedEmail.recipients.map((r) => r.email));
    }
  };

  // step 4: submit tracking
  const handleStartTracking = () => {
    if (!selectedEmail) return;
    if (selectedRecipientEmails.length === 0) {
      triggerToast("Please select at least one recipient to track.", "info");
      return;
    }

    // format date into human readable format
    const dateObj = new Date(`${deadlineDate}T${deadlineTime}`);
    const formatedDeadline = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // map selected recipients
    const trackingRecipients: Recipient[] = selectedEmail.recipients
      .filter((r) => selectedRecipientEmails.includes(r.email))
      .map((r) => ({
        name: r.name,
        email: r.email,
        responded: false,
        remindersSent: 0,
      }));

    // creating tracking email log
    const initialLog: ActivityLog = {
      id: `log-sent-${Date.now()}`,
      type: "sent",
      description: `Email response tracking initiated with ${trackingRecipients.length} recipients. Deadline set for ${formatedDeadline}.`,
      timestamp: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newTrackedEmail: Omit<TrackedEmail, "id"> = {
      subject: selectedEmail.subject,
      sentDate: selectedEmail.sentDate,
      deadline: `Due ${formatedDeadline}`,
      status: "Pending",
      recipients: trackingRecipients,
      activityLogs: [initialLog],
    };

    addTrackedEmail(newTrackedEmail);
    triggerToast(
      `Started tracking response loop for "${selectedEmail.subject}"`,
      "success",
    );
    navigate("/tracked");
  };

  // helper to format steps title
  const steps = [
    { num: 1, label: "Select Email", desc: "Choose outbox thread" },
    { num: 2, label: "Recipients", desc: "Map respondents" },
    { num: 3, label: "Deadline", desc: "Set due date & time" },
    { num: 4, label: "Review & Start", desc: "Activate tracking" },
  ];

  return (
    <div className="w-full text-left px-6 md:px-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to={"/tracked"}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#777587] hover:text-[#3525cd] transition-all cursor-pointer"
        >
          <ArrowLeft size={14} className="stroke-2.5" />
          Back to Tracked Emails
        </Link>
        <span className="text-xs font-mono text-[#777587] font-semibold">
          Step {step} of 4
        </span>
      </div>

      {/* Header title */}
      <div className="mb-8">
        <h2 className="font-sans text-2xl md:text-3xl font-black text-[#0b1c30] tracking-tight">
          Track New Response Loop
        </h2>
        <p className="font-sans text-sm text-[#777587] mt-1.5 max-w-2xl">
          Set up accountability workflows by mapping existing sent emails to
          response goals, deadline, and automated reminders
        </p>
      </div>

      {/* Primary Workflow container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* left main area */}
        <div className="lg:col-span-8 space-y-6">
          {/* steeper progress bar */}
          <div className="bg-white border border-[#c7c4d8]/20 rounded-2xl p-5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center justify-between w-full">
                {steps.map((s, index) => {
                  const isActive = step === s.num;
                  const isCompleted = step > s.num;
                  const isUpcoming = step < s.num;

                  return (
                    <React.Fragment key={s.num}>
                      <button
                        type="button"
                        onClick={() => {
                          // only allow going back to already completed steps
                          if (s.num == 1) setStep(1);
                          else if (s.num == 2 && selectedEmail) setStep(2);
                          else if (s.num == 3 && selectedEmail) setStep(3);
                        }}
                        disabled={
                          s.num > step &&
                          (!selectedEmail ||
                            (s.num === 3 &&
                              selectedRecipientEmails.length === 0))
                        }
                        className="flex items-center gap-2 md:gap-2.5 text-left focus:outline-none group disable:cursor-not-allowed transition-all duration-200 shrink-0"
                      >
                        {/* step circle */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 shrink-0 ${
                            isActive
                              ? "bg-[#3525cd] text-white shadow-md shadow-[#3525cd]/15 ring-4 ring-[#3525cd]/15"
                              : isCompleted
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-white border border-[#c7c4d8]/40 text-[#777587]/70"
                          }`}
                        >
                          {isCompleted ? (
                            <Check size={14} className="stroke-3" />
                          ) : (
                            <span>{s.num}</span>
                          )}
                        </div>

                        {/* step Titles */}
                        <div className="hidden sm:block">
                          <p
                            className={`font-sans text-xs font-bold transition-colors duration-200 whitespace-nowrap
                              ${isActive ? "text-[#0b1c30]" : isCompleted ? "text-emerald-700/90" : "text-[#777587] group-hover:text-[#0b1c30]"}
                              `}
                          >
                            {s.label}
                          </p>
                          <p className="font-sans text-[10px] text-[#777587]/60 hidden lg:block font-medium mt-0.5 leading-tight">
                            {s.desc}
                          </p>
                        </div>
                      </button>

                      {/* modern connector lines */}
                      {index < steps.length - 1 && (
                        <div className="relative flex-1 mx-2 md:mx-4 h-[1.5px] rounded-full bg-[#f1f0f7] overflow-hidden min-w-3">
                          <div
                            className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${
                              isCompleted
                                ? "bg-emerald-500 w-full"
                                : isActive
                                  ? "bg-[#3525cd]/40 w-1/2"
                                  : "w-0"
                            }`}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* contextual indicator */}
              {selectedEmail && (
                <div className="text-center w-full mt-1 border-t border-[#c7c4d8]/10  pt-3 flex justify-center">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3525cd] bg-[#eff4ff] px-3 py-1 rounded-full border border-[#3525cd]/10 font-sans">
                    <CheckCircle2 />
                    Loop target:
                    <strong className="font-bold">
                      {selectedEmail.subject.substring(0, 32)}...
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* step1: Search and select emails */}
          {step === 1 && (
            <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border border-[#c7c4d8]/15 pb-4">
                <h3 className="font-sans text-base font-black text-[#0b1c30]">
                  Step 1: Select a Sent Email
                </h3>
                <p className="font-sans text-xs text-[#777587] mt-0.5">
                  Choose the email thread you have already dispatched that
                  requires structured responses.
                </p>
              </div>

              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sent emails by subject or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0b1c30] placeholder-[#777587]/60 focus:outline-none focus:ring-1  focus:ring-[#3525cd] font-sans "
                />
              </div>
              <div>
                {filteredSentEmails.length === 0 ? (
                  <div>
                    <Mail />
                    <p>No matches found for "{searchTerm}"</p>
                    <p>Try searching with a different term.</p>
                  </div>
                ) : (
                  filteredSentEmails.map((email) => (
                    <div className="group border border-[#c7c4d8]/20  hover:border-[#3525cd]/40 hover:bg-[#f8f9ff]/20 rounded-2xl transition-all cursor-pointer text-left space-y-2 relative">
                      <div>first div</div>

                      <p>paragraph</p>

                      <div>second div</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* step2
          <div>step2</div>

          {/* step3 */}
          {/* <div>step2</div> */}

          {/* step4 */}
          {/* <div>step2</div> */}
        </div>

        {/* Right side: side bar with contextual tips */}
        <div>Right side</div>
      </div>
    </div>
  );
};

export default TrackNew;

// const query = useUrlQuery();
// const id = query.get("id");
// const navigate = useNavigate();

// // find recipients of this email id
// const { data: recipients, isPending, error } = useEmailRecipients(id!);

// const [selected, setSelected] = useState<string[]>([]);

// const sumbitHandler = (e: FormEvent) => {
//   e.preventDefault();
//   mutation.mutate();
// };

// const sent_data = {
//   recipient_emails: recipients,
//   must_respond_emails: selected,
// };

// const mutation = useMutation({
//   mutationFn: () =>
//     axios.post(`http://localhost:8000/emails/${id}/track`, sent_data),
//   onSuccess: () => {
//     navigate("/tracked");
//   },
//   onError: (error: any) => {
//     console.log(error.message);
//   },
// });

// if (isPending) return <TrackNewSkeleton />;

// if (error)
//   return <p className="m-4 p-4 bg-red-100 rounded-md">{error.message}</p>;

// if (mutation.error)
//   return <p className="m-10 p-4 bg-red-100 rounded-md">{mutation.error}</p>;
