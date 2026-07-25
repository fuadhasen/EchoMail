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
  RefreshCw,
  Search,
  SpaceIcon,
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
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
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

  const searchResults = useMemo(() => {
    if (!activeQuery.trim()) return [];
    const query = activeQuery.toLowerCase().trim();
    return sentEmails.filter((email) => {
      const matchesQuery =
        email.subject.toLowerCase().includes(query) ||
        email.snippet.toLowerCase().includes(query) ||
        email.recipients.filter(
          (r) =>
            r.name.toLowerCase().includes(query) ||
            r.email.toLowerCase().includes(query),
        );

      return matchesQuery;
    });
  }, [sentEmails, activeQuery]);

  const handleExecuteSearch = (queryToSearch?: string) => {
    const term = queryToSearch !== undefined ? queryToSearch : searchInput;
    if (queryToSearch !== undefined) {
      setSearchInput(queryToSearch);
    }

    if (!term.trim()) {
      triggerToast(
        "Please enter a subject or keyword to search your sent emails.",
        "info",
      );
    }

    setIsSearching(true);
    setHasSearched(true);
    setActiveQuery(term);

    // simulate real backend query delay
    setTimeout(() => {
      setIsSearching(false);
    }, 1000);
  };

  // Quick chip click handler (suggested tag)
  const handleTagClick = (tag: string) => {
    handleExecuteSearch(tag);
  };

  // clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setActiveQuery("");
    setHasSearched(false);
  };

  // Select an email thread
  const handleSelectEmail = (email: SentEmail) => {
    setFetchingThreadId(email.id);
    setSelectedEmail(email);

    // simulate the backend fetching thread recipients
    setTimeout(() => {
      setFetchingThreadId(null);
      // auto select all recipients initially
      setSelectedRecipientEmails(email.recipients.map((r) => r.email));
    }, 550);

    // move to step 2 with recipient skeleton loading
    setStep(2);
    setIsLoadingRecipients(true);
    setTimeout(() => {
      setIsLoadingRecipients(false);
    }, 400);
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

  // Set quick deadline helper (+24h, +3d, +1w)
  const handleSetQuickDeadline = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    setDeadlineDate(d.toISOString().split("T")[0]);
  };

  // step 3: Final submit tracking
  const handleStartTracking = () => {
    if (!selectedEmail) return;
    if (selectedRecipientEmails.length === 0) {
      triggerToast("Please select at least one recipient to track.", "info");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // format deadline string
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
    }, 800);
  };

  // helper to format steps title
  const steps = [
    {
      num: 1,
      label: "Search Sent Emails",
      desc: "Locate outbox thread from Gmail",
    },
    {
      num: 2,
      label: "Select Recipients",
      desc: "Specify required respondents",
    },
    {
      num: 3,
      label: "Configure SLA Rules",
      desc: "Set deadline & notification cadence",
    },
  ];

  return (
    <div className="w-full text-left space-y-6 pb-12">
      {/*Top Header Navigation and Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div className="flex items-center gap-3">
          <Link
            to={"/tracked"}
            className="p-2 rounded-xl bg-white border border-slate-200 text-[#777587] hover:text-[#3525cd] hover:border-[#3525cd]/30 shadow-2xs gap-2 cursor-pointer group"
            title="Back to Tracked Emails"
          >
            <ArrowLeft
              size={14}
              className="stroke-2.5 group-hover:-translate-x-0.5 transition-transform"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#3525cd]/10 text-[#3525cd] text-[10px] font-extrabold uppercase tracking-widest font-mono">
                Response Loop Builder
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 font-mono text-[11px]">
                Gmail Outbox Sync
              </span>
            </div>
            <h1 className="font-sans text-2xl md:text-3xl font-black text-[#0b1c30] tracking-tight mt-0.5">
              Track New Sent Email
            </h1>
          </div>
        </div>

        {/* Live API Telemetry badge */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 py-1.5 px-3 rounded-xl text-xs font-mono text-emerald-800 font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Outbox Connection</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 bg-slate-100border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-mono text-[#777587]">
            <RefreshCw size={12} className="text-slate-400" />
            <span>OAuth 2.0 Active</span>
          </div>
        </div>
      </div>

      {/* Full width stepper progress bar */}
      <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-4 md:p-6  shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, index) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  // only allow going back to already completed steps
                  if (s.num == 1) setStep(1);
                  else if (s.num == 2 && selectedEmail) setStep(2);
                }}
                disabled={
                  s.num > step &&
                  (!selectedEmail ||
                    (s.num === 3 && selectedRecipientEmails.length === 0))
                }
                className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer disabled:cursor-not-allowed ${
                  isActive
                    ? "border-[#3525cd] bg-indigo-50/40 ring-2 ring-[#3525cd]/10 shadow-2xs"
                    : isCompleted
                      ? "border-emerald-200 bg-emerald-50/30"
                      : "border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? "bg-[#3525cd] text-white shadow-md shadow-[#3525cd]/20"
                        : isCompleted
                          ? "bg-emerald-500 text-white shadow-2xs"
                          : "bg-white border border-slate-300 text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <Check size={16} className="stroke-3" />
                    ) : (
                      <span>0{s.num}</span>
                    )}
                  </div>
                  <div>
                    <p
                      className={`font-sans text-xs font-extrabold ${
                        isActive
                          ? "text-[#0b1c30]"
                          : isCompleted
                            ? "text-emerald-900"
                            : "text-[#777587]"
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="font-sans text-[11px] text-[#777587] font-medium mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <div className="hidden lg:block">
                  {isCompleted && (
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase bg-emerald-100/60 px-2 py-0.5 rounded">
                      Ready
                    </span>
                  )}
                  {isActive && (
                    <span className="text-[10px] font-mono font-bold text-[#3525cd] uppercase bg-indigo-100/60 px-2 py-0.5 rounded">
                      In Progress
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Email Banner Context Bar */}
        {selectedEmail && step > 1 && (
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="text-[10px] uppercase font-mono font-bold text-[#777587] bg-slate-100 px-2 py-0.5 rounded shrink-0">
                Active Thread
              </span>
              <span className="font-mono text-[11px] font-bold text-[#3525cd] shrink-0">
                #{selectedEmail?.thread_id}
              </span>
              <span className="font-sans font-bold text-[#0b1c30] truncate">
                {selectedEmail?.subject}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[#3525cd] font-bold hover:underline cursor-pointer shrink-0 text-right"
            >
              Change Email
            </button>
          </div>
        )}
      </div>

      {/* Main 12 Column Responsive Dashboared Layout*/}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* left main area */}
        <div className="lg:col-span-8 space-y-6">
          {/* steeper progress bar */}

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
