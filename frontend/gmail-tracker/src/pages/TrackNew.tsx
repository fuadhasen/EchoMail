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
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Mail,
  Search,
  User,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

const TrackNew = () => {
  const navigate = useNavigate();
  const { triggerToast } = useToast();

  // workflow step state (1 to 4)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Sent Emails master data
  const sentEmails = useMemo(() => getSentEmails(), []);

  // Step 1: States
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [hasSearched, setHasSearched] = useState("");
  const [isSearching, setIsSearching] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Thread selection state
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);
  const [fetchingThreadId, setFetchingThreadId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  // step 2: States (Recipient)
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [selectedRecipientEmails, setSelectedRecipientEmails] = useState<
    string[]
  >([]);

  // step 3: States (Tracking Settings)
  const [deadlineDate, setDeadlineDate] = useState(() => {
    // default to 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  });
  const [deadlineTime, setDeadlineTime] = useState("17:00"); //5 pm
  const [reminderInterval, setReminderInterval] = useState<
    "24h" | "48h" | "12h_before"
  >("24h");
  const [notifyOnResponse, setNotifyOnResponse] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Suggested quick search terms
  const suggestedKeywords = [
    "Project Apollo",
    "Annual Budget",
    "Operations",
    "Dashboard",
    "Contract",
    "Roadmap",
  ];

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
              <div className="space-y-3.5">
                <div className="p-8 text-center border border-dashed border-[#c7c4d8]/20 rounded-2xl bg-[#f8f9ff]/30">
                  <Mail className="mx-auto text-[#777587]/40 mb-2" />

                  <p className="font-sans text-[11px] text-[#777587]/70 mt-1">
                    Choose the email thread you have already dispatched that
                    requires structured responses.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* step2: choose recipients */}
          {step === 2 && selectedEmail && (
            <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border-b border-[#c7c4d8]/15 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-sans text-base font-black text-[#0b1c30]">
                    Step 2: Map Required Respondents
                  </h3>
                  <p className="font-sans text-xs text-[#777587] mt-0.5">
                    Which recipients are required to provide a reply to this
                    thread?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAllRecipients}
                  className="bg-slate-50 border  border-[#c7c4d8]/30 hover:bg-[#f8f9ff] text-[#464555] text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer font-sans self-start sm:self-center"
                >
                  {selectedRecipientEmails.length ===
                  selectedEmail.recipients.length
                    ? "Deselect All"
                    : "select All Recipients"}
                </button>
              </div>

              {/* recipient checklist Grid */}
              <div className="border border-[#c7c4d8]/20 rounded-2xl overflow-hidden divide-y divide-[#c7c4d8]/15 bg-[#f8f9ff]/10">
                {selectedEmail.recipients.map((recipient) => {
                  const isSelected = selectedRecipientEmails.includes(
                    recipient.email,
                  );
                  return (
                    <div
                      key={recipient.email}
                      onClick={() => handleToggleRecipient(recipient.email)}
                      className={`p-4 flex items-center justify-between hover:bg-[#f8f9ff]/30 transition-all cursor-pointer ${isSelected ? "bg-[#eff4ff]/10" : ""}`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* custom checkbox */}
                        <div
                          className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-all 
                          ${isSelected ? "bg-[#3525cd] border-[#3525cd] text-white" : "border-[#c7c4d8]/60 bg-white"}
                        `}
                        >
                          {isSelected && (
                            <Check size={11} className="stroke-3.5" />
                          )}
                        </div>

                        <div className="text-left">
                          <p
                            className={`font-sans text-xs font-bold transition-colors ${isSelected ? "text-[#0b1c30]" : "text-[#464555]"}`}
                          >
                            {recipient.name}
                          </p>
                          <p className="font-mono text-[10px] text-[#777587]">
                            {recipient.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isSelected
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-[#777587] border-slate-200 opacity-60"
                        }`}
                      >
                        {isSelected ? "Tracking Active" : "Ignored"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* bottom actions */}
              <div className="pt-5 border-t border-[#c7c4d8]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-white border border-[#c7c4d8]/30 hover:bg-slate-50 text-[#777587] py-2 px-4 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} className="stroke-2.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={selectedRecipientEmails.length === 0}
                  className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 disabled:bg-slate-200  disabled:text-slate-400 disabled:cursor-not-allowed py-2.5 px-5 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center gap-1.5"
                >
                  setDeadline <ArrowRight size={13} className="stroke-2.5" />
                </button>
              </div>
            </div>
          )}

          {/* step 3: Set Deadline */}
          {step === 3 && selectedEmail && (
            <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border border-[#c7c4d8]/15 pb-4">
                <h3 className="font-sans text-base font-black text-[#0b1c30]">
                  Step 3: Establish Deadline Target
                </h3>
                <p className="font-sans text-xs text-[#777587] mt-0.5">
                  Set the absolute target window for recipients to reply before
                  flagging thier status as overdue.
                </p>
              </div>

              {/* date time picker input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#777587] uppercase tracking-wider mb-2">
                    Date of Deadline
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587] w-4 h-4" />
                    <input
                      type="date"
                      value={deadlineDate}
                      onChange={(e) => setDeadlineDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-[#f8f9ff] border  border-[#c7c4d8]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#3525cd] font-sans cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-[#777587] uppercase tracking-wider mb-2">
                    Time of Deadline
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587] w-4 h-4" />
                    <input
                      type="time"
                      value={deadlineTime}
                      onChange={(e) => setDeadlineTime(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#3525cd] font-sans cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* informative helper card */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/40 rounded-xl flex items-start gap-3">
                <AlertCircle
                  size={15}
                  className="text-amber-600 mt-0.5 shrink-0"
                />
                <div className="text-left text-xs">
                  <p className="font-sans font-bold text-amber-900">
                    Calculated Alert Window
                  </p>
                  <p className="font-sans text-amber-700/90 mt-0.5 leading-relaxed">
                    Once the deadline passes on{" "}
                    <strong className="font-extrabold">
                      {new Date(
                        `${deadlineDate}T${deadlineTime}`,
                      ).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </strong>
                    , automated reminders will fire at regular intervals and the
                    overall thread is labeled "Overdue".
                  </p>
                </div>
              </div>

              {/* bottom action */}
              <div className="pt-5 border-t border-[#c7c4d8]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-white border border-[#c7c4d8]/30 hover:bg-slate-50 text-[#777587] py-2 px-4 rounded-xl text-xs font-bold font-sans cursor-pointer transitiona-all flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} className="stroke-2.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 py-2.5 px-5 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center gap-1.5 "
                >
                  Review Summary
                  <ArrowRight size={13} className="stroke-2.5" />
                </button>
              </div>
            </div>
          )}

          {/* step4: Review Summary */}
          {step === 4 && selectedEmail && (
            <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="border-b border-[#c7c4d8]/15 pb-4">
                <h3 className="font-sans text-base font-black text-[#0b1c30]">
                  Step 4: Finalize & Launch Response Loop
                </h3>
                <p className="font-sans text-xs text-[#777587] mt-0.5">
                  Ensure all details are accurate before locking this email
                  thread into the active response monitoring system.
                </p>
              </div>
              <div className="space-y-4">
                {/* email subject section */}
                <div className="bg-[#f8f9ff] border border-[#c7c4d8]/20 rounded-xl p-4 text-left">
                  <span className="block text-[10px] font-bold text-[#777587] uppercase tracking-wider">
                    Email Subject
                  </span>
                  <span className="block text-sm font-extrabold text-[#0b1c30] mt-1 leading-snug">
                    {selectedEmail.subject}
                  </span>
                  <span className="inline-block font-mono text-[9px] text-[#777587] font-semibold bg-white border border-slate-100 px-2 py-0.5 rounded mt-2">
                    Sent Date: {selectedEmail.sentDate}
                  </span>
                </div>

                {/* deadline and tracking settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#f8f9ff] border border-[#c7c4d8]/20 rounded-xl p-4 text-left">
                    <span className="block text-[10px] font-bold text-[#777587] uppercase tracking-wider">
                      Configured Deadline
                    </span>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-amber-700 font-extrabold">
                      <Calendar size={13} className="text-amber-600" />
                      <span>
                        {new Date(
                          `${deadlineDate}T${deadlineTime}`,
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span>{deadlineTime}</span>
                    </div>
                  </div>
                  <div className="bg-[#f8f9ff] border border-[#c7c4d8]/20 rounded-xl p-4 text-left ">
                    <span className="block text-[10px] font-bold text-[#777587] uppercase tracking-wider">
                      Tracking Recipients
                    </span>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-[#3525cd] font-bold">
                      <User size={13} />
                      <span>
                        {selectedRecipientEmails.length} of{" "}
                        {selectedEmail.recipients.length} Recipients Tracked
                      </span>
                    </div>
                  </div>
                </div>

                {/* recipient breakdown list */}
                <div className="space-y-2 text-left">
                  <span className="block text-[10px] font-bold text-[#777587] uppercase tracking-wider px-1">
                    Selected Respondents
                  </span>
                  <div className="border border-[#c7c4d8]/15 rounded-xl divide-y divide-[#c7c4d8]/10 max-h-48 overflow-y-auto custom-scrollbar bg-slate-50/20 scrollbar-none">
                    {selectedEmail.recipients
                      .filter((r) => selectedRecipientEmails.includes(r.email))
                      .map((r) => (
                        <div
                          key={r.email}
                          className="p-3 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#eff4ff] text-[#3525cd] flex items-center justify-center font-bold text-[10px] font-sans">
                              {r.name.charAt(0)}
                            </div>
                            <span className="font-sans font-bold text-[#0b1c30]">
                              {r.name}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-[#777587]">
                            {r.email}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="pt-5 border-t border-[#c7c4d8]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-white border border-[#c7c4d8]/30 hover:bg-slate-50 text-[#777587] py-2 px-4 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} className="stroke-2.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStartTracking}
                  className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 py-2.5 px-6 rounded-xl text-xs font-black font-sans cursor-pointer transition-all flex items-center gap-1.5 shadow-md active:scale-98"
                >
                  <CheckCircle2 size={13} className="stroke-2.5" />
                  Track Email
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right side: side bar with contextual tips */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 shadow-xs">
            <h4 className="font-sans text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-3">
              Echomail Tracking Engine
            </h4>
            <div className="space-y-4 text-xs text-[#464555] leading-relaxed">
              <div className="border-l-2 border-[#3525cd] pl-3">
                <p className="font-sans font-bold text-[#0b1c30]">
                  How response tracking works
                </p>
                <p className="font-sans text-[#777587] mt-0.5">
                  EchoMail connects to your sent outbox. It scans recipient
                  incoming replies to automatically mark tracking goals as
                  completed.
                </p>
              </div>
              <div className="border-l-2 border-amber-500 pl-3">
                <p className="font-sans font-bold text-[#0b1c30]">
                  The "Must Respond" setting
                </p>
                <p className="font-sans text-[#777587] mt-0.5">
                  Only selected recipients will trigger alerts or reminders.
                  Unselected contact are kept on the thread but won't block
                  completion.
                </p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3">
                <p className="font-sans font-bold text-[#0b1c30]">
                  Seamless FastAPI Migration
                </p>
                <p className="font-sans text-[#777587] mt-0.5">
                  The architecture mapped in this workflow utilizes standalone
                  mail-item parameters that directly trace to future cloud
                  database models.
                </p>
              </div>
            </div>
          </div>
          {selectedEmail && step > 1 && (
            <div className="bg-slate-50 border border-[#c7c4d8]/20 rounded-2xl p-6 text-left">
              <h5 className="font-sans text-[11px] font-extrabold text-[#777587] uppercase tracking-wider mb-2">
                Selected Email Specs
              </h5>
              <div className="space-y-2 text-xs font-sans">
                <div>
                  <span className="text-[#777587] block text-[10px] uppercase">
                    Subject
                  </span>
                  <span className="text-[#0b1c30] font-bold line-clamp-1">
                    {selectedEmail.subject}
                  </span>
                </div>
                <div>
                  <span className="text-[#777587] block text-[10px] uppercase">
                    Sent Date
                  </span>
                  <span className="text-[#0b1c30] font-semibold">
                    {selectedEmail.sentDate}
                  </span>
                </div>
                <div>
                  <span className="text-[#777587] block text-[10px] uppercase">
                    Original Recipients
                  </span>
                  <span className="text-[#0b1c30] font-semibold">
                    {selectedEmail.recipients.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
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
