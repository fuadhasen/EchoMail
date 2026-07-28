import SearchLoadingSkeleton from "@/components/skeletons/SearchLoadingSkeleton";
import { useToast } from "@/context/ToastContext";
import {
  addTrackedEmail,
  type ActivityLog,
  type Recipient,
  type TrackedEmail,
} from "@/data/mockTrackedEmails";
import useSentEmails from "@/hooks/useSentEmails";
import type { SentEmail } from "@/type";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Inbox,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Tag,
  User,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const TrackNew = () => {
  const navigate = useNavigate();
  const { triggerToast } = useToast();

  // workflow step state (1 to 4)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: States
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  // Sent Emails master data
  const { data, isPending, isFetching, error } = useSentEmails(activeQuery);
  const sentEmails = data?.emails ?? [];

  // Thread selection state
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);
  const [fetchingThreadId, setFetchingThreadId] = useState<string | null>(null);

  // step 2: States (Recipient), all recipient can be accessed through selectedemail.recipients
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  // must respond
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

    setHasSearched(true);
    // search input will be used as active query, means the user hit the search button
    setActiveQuery(term);
  };

  // clear search
  const handleClearSearch = () => {
    setSearchInput("");
    setActiveQuery("");
    setHasSearched(false);
  };

  // Select an email thread
  const handleSelectEmail = (email: SentEmail) => {
    setFetchingThreadId(email.thread_id);
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
          {steps.map((s) => {
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
            <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-sans text-lg text-[#0b1c30] font-black flex items-center gap-2">
                    <Search size={18} className="text-[#3525cd]" />
                    Search Sent Outbox
                  </h3>
                  <p className="font-sans text-xs text-[#777587] mt-0.5">
                    Search your sent emails by subject line, recipient name, or
                    keywords.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Mail size={13} />
                  <span>Showing gmail sent items</span>
                </div>
              </div>

              {/* Search Input Bar */}
              <div className="space-y-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecuteSearch();
                  }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Type email subject, snippet or project keywords..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/30 rounded-xl pl-11 pr-10 py-3 text-xs text-[#0b1c30] placeholder-slate-400  focus:outline-none focus:ring-2  focus:ring-[#3525cd]/20 focus:border-[#3525cd] font-sans transition-all shadow-2xs"
                    />
                    {searchInput && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isFetching}
                    className="bg-[#3525cd] hover:bg-[#3525cd]/90 active:scale-[0.98] text-white py-3 px-7 rounded-xl text-xs font-black font-sans cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-75 shrink-0"
                  >
                    {isFetching ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search size={14} className="stroke-2.5" />
                        <span>Search Sent Emails</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* SEARCH RESULTS DISPLAY ENGINE */}

              {/* STATE A: Initial Empty Search Hero state */}
              {!hasSearched && (
                <div className="p-8 md:p-12 border-2 border-dashed border-[#c7c4d8]/30 rounded-2xl bg-[#f8f9ff]/50 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-[#3525cd] shadow-2xs">
                    <Inbox size={26} />
                  </div>
                  <div className="space-y-1.5 max-w-lg mx-auto">
                    <h4 className="font-sans text-base font-extrabold text-[#0b1c30]">
                      Search your sent Gmail outbox to initiate response
                      tracking
                    </h4>
                    <p className="font-sans text-xs text-[#777587] leading-relaxed">
                      Enter a subject keyword or select one of the suggested
                      tags above. EchoMail will scan your outbox threads and map
                      required respondents automatically.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleExecuteSearch("Project Apollo")}
                      className="inline-flex items-center gap-2 text-xs font-extrabold text-white bg-[#3525cd] px-5 py-2.5 rounded-xl hover:bg-[#3525cd]/90 transition-all cursor-pointer shadow-xs"
                    >
                      <span>Search "Project Apollo"</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* STATE B: Asynchronus loading skeletons */}
              {hasSearched && isPending && <SearchLoadingSkeleton />}

              {/* STATE ERROR */}
              {hasSearched && !isPending && error && (
                <div className="p-10 text-center border-2 border-dashed border-red-200 rounded-2xl bg-red-50/30 space-y-3">
                  <div className="w-12 h-12 rounded-full  bg-red-100 text-red-600  flex items-center justify-center mx-auto">
                    <AlertTriangle size={22} />
                  </div>

                  <h4 className="font-bold text-[#0b1c30]">
                    Unable to search Gmail
                  </h4>

                  <p className="text-xs text-[#777587]">
                    Something went wrong while fetching your sent emails. Please
                    try again
                  </p>
                  <button
                    onClick={() => handleExecuteSearch(activeQuery)}
                    className="text-xs font-bold  text-white bg-[#3525cd] px-4 py-2 rounded-xl"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* STATE C: no results , empty state */}
              {hasSearched &&
                !isPending &&
                !isFetching &&
                !error &&
                sentEmails.length === 0 && (
                  <div className="p-10 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                      <AlertCircle size={22} />
                    </div>
                    <h4 className="font-sans text-sm font-bold text-[#0b1c30]">
                      No outbox threads found matching "{activeQuery}"
                    </h4>

                    <p className="font-sans text-xs text-[#777587] max-w-md mx-auto">
                      Check for typos or try searching by recipient email
                      address or broader project keywords.
                    </p>
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="inline-block text-xs font-bold text-[#3525cd] bg-white border border-[#3525cd]/30 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all cursor-pointer mt-2"
                    >
                      Clear Search Filter
                    </button>
                  </div>
                )}

              {/* STATE D: Spacious Full Width Search Results Cards */}
              {hasSearched &&
                !isPending &&
                !isFetching &&
                !error &&
                sentEmails.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#777587] px-1 font-sans">
                      <span className="font-bold text-[#0b1c30]">
                        Found {sentEmails.length} matching sent outbox threads
                      </span>
                      <span className="font-mono text-[11px] bg-slate-100 px-2.5 py-0.5 rounded-md">
                        Query: "{activeQuery}"
                      </span>
                    </div>

                    {sentEmails.map((email) => {
                      const isFetchingThis = fetchingThreadId === email.id;

                      return (
                        <div
                          key={email.id}
                          onClick={() =>
                            !fetchingThreadId && handleSelectEmail(email)
                          }
                          className={`group p-6 border rounded-2xl transition-all cursor-pointer text-left space-y-4 relative ${
                            isFetchingThis
                              ? "border-[#3525cd] bg-indigo-50/50 shadow-md ring-2 ring-[#3525cd]/10"
                              : "border-[#c7c4d8]/30 hover:border-[#3525cd]/60 hover:bg-[#f8f9ff]/50 bg-white hover:shadow-xs"
                          }`}
                        >
                          {/* header row */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/80 pb-3">
                            <div className="flex items-center gap-2.5 pr-4">
                              <span className="font-mono text-[11px] font-extrabold text-[#3525cd] bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md shrink-0">
                                #{email.thread_id}
                              </span>
                              <h4 className="font-sans text-sm sm:text-base font-extrabold text-[#0b1c30] group-hover:text-[#3525cd] transition-colors line-clamp-1">
                                {email.subject}
                              </h4>
                            </div>
                            <span className="font-mono text-[11px] text-[#777587] font-bold bg-slate-100 px-3 py-1 rounded-lg whitespace-nowrap self-start sm:self-auto">
                              {email.sentDate}
                            </span>
                          </div>

                          {/* Body snippet */}
                          <div className="font-sans text-xs text-[#464555] line-clamp-2 leading-relaxed">
                            {email.snippet.substring(0, 129)}
                          </div>

                          {/* Footer bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center gap-1.5 font-sans text-[#3525cd] bg-[#eff4ff] px-3 py-1 rounded-lg font-bold text-xs border border-indigo-100/60">
                                <User size={13} />
                                {email.recipients.length} Recipients
                              </span>
                              <div className="flex -space-x-1.5 overflow-hidden">
                                {email.recipients.map((r) => (
                                  <div
                                    title={r.name}
                                    className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white text-[10px] font-bold text-slate-600 flex items-center justify-center font-mono"
                                  >
                                    {r.name.charAt(0)}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {isFetchingThis ? (
                              <span className="text-[#3525cd] font-bold inline-flex items-center gap-2 font-mono text-xs">
                                <RefreshCw size={14} className="animate-spin" />
                                Loading Thread Metadata...
                              </span>
                            ) : (
                              <span className="text-[#3525cd] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5 bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-indigo-100">
                                <span>Select & Map Recipients</span>
                                <ChevronRight
                                  size={14}
                                  className="stroke-2.5"
                                />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              {isFetching && !isPending && (
                <div className="flex items-center justify-between px-4 py-2 mb-3 rounded-xl bg-[#f8f9ff] border border-[#c7c4d8]/20">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#777587]">
                    <RefreshCw
                      size={13}
                      className="animate-spin text-[#3525cd]"
                    />
                    Updating Gmail outbox results...
                  </div>

                  <span className="text-[10px] font-mono text-[#3525cd] bg-indigo-50 px-2 py-1 rounded-md">
                    Syncing
                  </span>
                </div>
              )}
            </div>
          )}

          {/* step2: choose recipients */}
          {step === 2 && selectedEmail && (
            <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-sans text-lg  font-black text-[#0b1c30] flex items-center gap-2">
                    <UserCheck size={18} className="text-[#3525cd]" />
                    Select Required Recipients
                  </h3>
                  <p className="font-sans text-xs text-[#777587] mt-0.5">
                    Select the respondents whose replies are mandatory for this
                    email thread.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleSelectAllRecipients}
                    className="bg-slate-50 border  border-slate-200 hover:bg-slate-100 text-[#464555] text-xs font-bold py-2 px-3.5 rounded-xl transition-all cursor-pointer font-sans"
                  >
                    {selectedRecipientEmails.length ===
                    selectedEmail.recipients.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>
                </div>
              </div>

              {/* recipient checklist Grid */}
              {isLoadingRecipients ? (
                <div className="border border-slate-200/80 rounded-xl divide-y divide-slate-100 bg-white overflow-hidden">
                  {[1, 2, 3, 4].map((id) => (
                    <div
                      key={id}
                      className="p-3.5 flex items-center gap-3 animate-pulse bg-slate-50/30"
                    >
                      <div className="w-4 h-4 rounded bg-slate-200 shrink-0" />
                      <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-1">
                        <div className="w-32 h-3.5 bg-slate-200 rounded" />
                        <div className="w-48 h-3 bg-slate-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-slate-200/80 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-95 bg-white overflow-y-auto shadow-2xs">
                  {selectedEmail.recipients.map((recipient) => {
                    const isSelected = selectedRecipientEmails.includes(
                      recipient.email,
                    );
                    return (
                      <div
                        key={recipient.email}
                        onClick={() => handleToggleRecipient(recipient.email)}
                        className={`px-4 py-3 transition-colors cursor-pointer flex items-center justify-between text-left space-x-3 select-none  ${isSelected ? "bg-[#eff4ff]/60 hover:bg-[#eff4ff]/80" : "bg-white hover:bg-slate-50/80"}`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* CheckBox */}
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${
                              isSelected
                                ? "bg-[#3525cd] border-[#3525cd] text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <Check size={11} className="stroke-3" />
                            )}
                          </div>

                          {/* Avatar Circle with initials */}
                          <div
                            className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center shrink-0 font-sans transition-colors ${
                              isSelected
                                ? "bg-[#3525cd] text-white shadow-2xs"
                                : "bg-indigo-50/80 text-[#3525cd] border border-indigo-100"
                            }`}
                          >
                            {recipient.name.charAt(0)}
                          </div>

                          {/* Recipient Details */}
                          <div className="min-w-0">
                            <p
                              className={`font-sans text-xs font-extrabold truncate ${isSelected ? "text-[#0b1c30]" : "text-[#2a2938]"}`}
                            >
                              {recipient.name}
                            </p>
                            <p className="font-mono text-[11px] text-[#777587] truncate mt-0.5">
                              {recipient.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Status Bar */}
              <div className="flex items-center justify-between text-xs text-[#777587] pt-1">
                <span>
                  <strong>{selectedRecipientEmails.length}</strong> of{" "}
                  <strong>{selectedEmail.recipients.length}</strong>
                </span>
                {selectedRecipientEmails.length === 0 && (
                  <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
                    <AlertCircle size={13} />
                    At least 1 recipient is required
                  </span>
                )}
              </div>

              {/* bottom actions */}
              <div className="pt-5 border-t border-[#c7c4d8]/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-[#777587] py-2.5 px-5 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center gap-2"
                >
                  <ArrowLeft size={14} className="stroke-2.5" />
                  <span>Back to Search</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={selectedRecipientEmails.length === 0}
                  className="bg-[#3525cd] text-white hover:bg-[#3525cd]/90 disabled:bg-slate-200  disabled:text-slate-400 disabled:cursor-not-allowed py-2.5 px-7 rounded-xl text-xs font-black font-sans cursor-pointer transition-all flex items-center gap-2 shadow-sm"
                >
                  <span>Configure SLA & Deadline</span>
                  <ArrowRight size={14} className="stroke-2.5" />
                </button>
              </div>
            </div>
          )}

          {/* step 3: Configure SLA & Deadline  */}
          {step === 3 && selectedEmail && (
            <div className="bg-white border border-[#c7c4d8]/30  rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-sans text-lg font-black text-[#0b1c30] flex items-center gap-2">
                  <Clock size={18} className="text-[#3525cd]" />
                  Configure Response SLA & Follow-up Rules
                </h3>
                <p className="font-sans text-xs text-[#777587] mt-0.5">
                  Set the absolute target window for recipients to reply before
                  flagging thier status as overdue.
                </p>
              </div>

              {/* Form Control Grid */}
              <div className="space-y-6">
                {/* Target Deadline Picker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-[#777587] uppercase tracking-wider">
                      1. Target Completion Deadline
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Target Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          value={deadlineDate}
                          onChange={(e) => setDeadlineDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full bg-[#f8f9ff] border  border-[#c7c4d8]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#3525cd] font-bold font-sans cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-[10px] font-extrabold text-slate-400 mb-1">
                        Time of Deadline
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="time"
                          value={deadlineTime}
                          onChange={(e) => setDeadlineTime(e.target.value)}
                          className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-[#0b1c30] focus:outline-none focus:ring-1 focus:ring-[#3525cd] font-sans cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Follow-up Reminder Cadence */}
                <div className="space-y-3">
                  <label className="block text-xs font-extrabold text-[#777587] uppercase tracking-wider">
                    2. Automated Reminder Cadence
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <button
                      type="button"
                      onClick={() => setReminderInterval("24h")}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        reminderInterval === "24h"
                          ? "border-[#3525cd] bg-indigo-50/50 ring-2 ring-[#3525cd]/10 shadow-2xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-sans text-xs font-black text-[#0b1c30]">
                          Daily Cadence
                        </span>
                        <Bell
                          size={13}
                          className={
                            reminderInterval === "24h"
                              ? "text-[#3525cd]"
                              : "text-slate-400"
                          }
                        />
                      </div>
                      <p className="font-sans text-[11px] text-[#777587] leading-relaxed">
                        Nudge unresponsive recipients every 24 hours until all
                        reply.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReminderInterval("48h")}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        reminderInterval === "48h"
                          ? "border-[#3525cd] bg-indigo-50/50 ring-2 ring-[#3525cd]/10 shadow-2xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-sans text-xs font-black text-[#0b1c30]">
                          Standard (48h)
                        </span>
                        <Bell
                          size={13}
                          className={
                            reminderInterval === "48h"
                              ? "text-[#3525cd]"
                              : "text-slate-400"
                          }
                        />
                      </div>
                      <p className="font-sans text-[11px] text-[#777587] leading-relaxed">
                        Nudge every 48 hours for standard non-urgent
                        deliverables.
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReminderInterval("12h_before")}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        reminderInterval === "12h_before"
                          ? "border-[#3525cd] bg-indigo-50/50 ring-2 ring-[#3525cd]/10 shadow-2xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-sans text-xs font-black text-[#0b1c30]">
                          Due Warning Only
                        </span>
                        <Bell
                          size={13}
                          className={
                            reminderInterval === "12h_before"
                              ? "text-[#3525cd]"
                              : "text-slate-400"
                          }
                        />
                      </div>
                      <p className="font-sans text-[11px] text-[#777587] leading-relaxed">
                        Send single reminder 12 hours prior to final SLA
                        expiration.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Notification setting toggle*/}
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl">
                    <input
                      type="checkbox"
                      checked={notifyOnResponse}
                      onChange={(e) => setNotifyOnResponse(e.target.checked)}
                      className="w-4 h-4 rounded text-[#3525cd] focus:ring-[#3525cd]/20 cursor-pointer"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold text-[#0b1c30] block">
                        Instant Desktop & Email Notifications
                      </span>
                      <span className="text-[11px] text-[#777587] block">
                        Alert me immediately as each recipient submits their
                        reply in the thread.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* bottom action */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-white border border-slate-200 hover:bg-slate-50 text-[#777587] py-2.5 px-5 rounded-xl text-xs font-bold font-sans cursor-pointer transitiona-all flex items-center gap-2"
                >
                  <ArrowLeft size={14} className="stroke-2.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleStartTracking}
                  disabled={isSubmitting}
                  className="bg-[#3525cd] text-white hover:bg-[#3525cd]/90 py-3.5 px-8 rounded-xl text-xs font-black font-sans cursor-pointer transition-all flex items-center gap-1.5 shadow-md disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      <span>Registering SLA Tracker...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} className="stroke-[2.5]" />
                      <span>Start Tracking Thread</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right side: side bar with contextual tips */}
        <div className="lg:col-span-4 space-y-6 text-left">
          {/* Thread Summary or workflow guide */}
          {selectedEmail ? (
            <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-black text-[#0b1c30] uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={14} className="text-[#3525cd]" />
                  Thread Overview
                </span>
                <span className="font-mono text-[10px] font-bold text-[#3525cd] bg-indigo-50 px-2 py-0.5 rounded">
                  {selectedEmail.thread_id}
                </span>
              </div>

              <div className="space-y-3 text-xs font-sans">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#777587]  block">
                    Subject
                  </span>
                  <p className="font-extrabold text-[#0b1c30] text-sm mt-0.5 leading-snug">
                    {selectedEmail.subject}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#777587]  block">
                    Original Outbox Send
                  </span>
                  <p className="font-semibold text-[#464555] font-mono text-[11px] mt-0.5">
                    {selectedEmail.sentDate}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#777587]  block">
                    Required Respondents
                  </span>
                  <p className="font-extrabold text-[#3525cd] text-xs mt-0.5">
                    {selectedRecipientEmails.length} of{" "}
                    {selectedEmail.recipients.length}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold uppercase text-[#777587] block mb-1.5">
                    Target SLA Timeline
                  </span>
                  <div className="p-3 bg-indigo-50/50 border border-indigo-100/80 rounded-xl space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between text-[#0b1c30]">
                      <span className="text-slate-500">Target Date:</span>
                      <span className="font-bold">{deadlineDate}</span>
                    </div>
                    <div className="flex justify-between text-[#0b1c30]">
                      <span className="text-slate-500">Target Time:</span>
                      <span className="font-bold">{deadlineTime}</span>
                    </div>
                    <div className="flex justify-between text-[#3525cd]">
                      <span className="text-slate-500">Cadence</span>
                      <span className="font-bold uppercase">
                        {reminderInterval}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // workflow guide
            <div className="bg-white border  border-[#c7c4d8]/30 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#0b1c30] ">
                <ShieldCheck size={18} className="text-[#3525cd]" />
                <h4 className="font-sans text-xs font-black uppercase tracking-wider">
                  How Response Tracking Works
                </h4>
              </div>

              <div className="space-y-4 text-xs text-[#464555] leading-relaxed font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-[#3525cd] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-[#0b1c30]">
                      Outbox Thread Audit
                    </p>
                    <p className="text-[#777587] text-[11px] mt-0.5">
                      EchoMail hooks directly into your Gmail outbox to mirror
                      active outgoing conversations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-[#3525cd] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-[#0b1c30]">
                      Selective Respondent Mapping
                    </p>
                    <p className="text-[#777587] text-[11px] mt-0.5">
                      Select specific team members or client contacts whose
                      explicit reply is required to close the loop.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-[#3525cd] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-bold text-[#0b1c30]">
                      Automated Nudges & Alerts
                    </p>
                    <p className="text-[#777587] text-[11px] mt-0.5">
                      If an SLA deadline passes, automated follow-up reminders
                      notify delinquent recipients silently.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Engine Health Panel */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#777587]">
              <span>Tracking Engine Specs</span>
              <span className="font-mono text-emerald-600 font-extrabold">
                Active
              </span>
            </div>

            <div className="space-y-2 text-xs font-sans">
              <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                <span className="text-[#777587]">Response Protocol</span>
                <span className="font-mono font-bold text-[#0b1c30]">
                  Gmail Webhook v2
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                <span className="text-[#777587]">Max Reminders</span>
                <span className="font-mono font-bold text-[#0b1c30]">
                  3 per recipient
                </span>
              </div>

              <div className="flex justify-between py-1 text-[11px]">
                <span className="text-[#777587]">Encryption</span>
                <span className="font-mono font-bold text-[#0b1c30]">
                  TLS / OAuth 2.0
                </span>
              </div>
            </div>
          </div>
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
