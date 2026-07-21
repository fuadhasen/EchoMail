import { useToast } from "@/context/ToastContext";
import {
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  Inbox,
  Loader2,
  Palette,
  RefreshCw,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  User,
} from "lucide-react";
import React, { useState } from "react";

interface ProfileSettings {
  fullName: string;
  email: string;
  jobTitle: string;
}

interface ReminderSettings {
  defaultDurationDays: number;
  triggerHourseBefore: number;
  templateMessage: string;
  autoArchiveOnReply: boolean;
  autoEscalateOverdue: boolean;
}

interface NotificationSettings {
  inAppToasts: boolean;
  browserPush: boolean;
  weeklyDigest: boolean;
  replyReminders: boolean;
}

const Settings = () => {
  const { triggerToast } = useToast();

  // loading and state variables
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingReminders, setIsSavingReminders] = useState(false);
  const [isSavingNotification, setIsSavingNotification] = useState(false);
  const [isSyncinGmail, setIsSyncinGamil] = useState(false);

  // load from local storage or set defaults
  const [profile, setProfile] = useState<ProfileSettings>(() => {
    const saved = localStorage.getItem("echomail_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      fullName: "Alex Rivera",
      email: "fuya241@gmail.com",
      jobTitle: "Product Manager",
    };
  });

  const [reminders, setReminders] = useState<ReminderSettings>(() => {
    const saved = localStorage.getItem("echomail_reminder_policies");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      defaultDurationDays: 3,
      triggerHourseBefore: 24,
      templateMessage:
        "Hi {name},\n\nJust sending a quick gentle bump on my previous email regarding Q4 plans. I wanted to make sure you had everything you need to review. Let me know if you have any questions!\n\nBest,\nAlex",
      autoArchiveOnReply: true,
      autoEscalateOverdue: false,
    };
  });

  const [notification, setNotification] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem("echomail_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      inAppToasts: true,
      browserPush: true,
      weeklyDigest: false,
      replyReminders: true,
    };
  });

  const [activeTheme, setActiveTheme] = useState<"light" | "dark" | "slate">(
    "light",
  );

  // Trigger Gmail reconnect demo
  const handleGmailSync = () => {
    if (isSyncinGmail) return;
    setIsSyncinGamil(true);
    setTimeout(() => {
      setIsSyncinGamil(false);
      triggerToast(
        "Gmail inbox connection successfully refreshed. 5 new sent threads analyzed.",
        "success",
      );
    }, 1200);
  };

  // const save profile settings
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setTimeout(() => {
      localStorage.setItem("echomail_profile", JSON.stringify(profile));
      setIsSavingProfile(false);
      triggerToast("Profile Settings updated successfully.", "success");
      // dispatch storage event to trigger side bar refresh
      window.dispatchEvent(new Event("storage"));
    }, 800);
  };
  // quick save switches instantly
  const toggleNotification = (key: keyof NotificationSettings) => {
    const updated = { ...notification, [key]: !notification[key] };
    setNotification(updated);
    localStorage.setItem("echomail_notification", JSON.stringify(updated));
    triggerToast("Notification preferences updated.", "success");
  };

  return (
    <div className="w-full text-left space-y-8 py-2">
      {/* Top section header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/50 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-bold text-[#0b1c30] tracking-tight">
            Settings
          </h1>
          <p className="font-sans text-xs text-zinc-500 mt-1">
            Configure your response tracking parameters, email follow-up
            defaults, and syncronized profiles.
          </p>
        </div>

        <div className="text-[11px] font-bold text-zinc-400 bg-zinc-100/70 border border-zinc-200/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-mono">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>REALTIME SYNCHRONIZED STATUS</span>
        </div>
      </div>

      {/* main section grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* left column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Card 1: Account and profile configuration */}
          <section className="bg-white border border-zinc-200/50 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-[#3525cd] rounded-xl shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-[#0b1c30] tracking-tight">
                    Account Profile
                  </h3>
                  <p className="font-sans text-xs text-zinc-400 mt-0.5">
                    Your personal identifiers for outgoing follow-up templates.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 text-left">
                  <label className="block font-sans text-xs font-bold text-[#0b1c30] tracking-wide uppercase">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.fullName}
                    onChange={(e) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-[#3525cd] focus:bg-white focus:outline-none rounded-xl px-4.5 py-3 font-sans text-xs font-semibold text-zinc-800 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
                    placeholder="e.g. Alex Rivera"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block font-sans text-xs font-bold text-[#0b1c30] tracking-wide uppercase">
                    Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.jobTitle}
                    onChange={(e) =>
                      setProfile({ ...profile, jobTitle: e.target.value })
                    }
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-[#3525cd] focus:bg-white focus:outline-none rounded-xl px-4.5 py-3 font-sans text-xs font-semibold text-zinc-800 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
                    placeholder="e.g. Product Lead"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block font-sans text-xs font-bold text-[#0b1c30] tracking-wide uppercase">
                  Work Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-[#3525cd] focus:bg-white focus:outline-none rounded-xl pl-4.5 pr-24 py-3 font-sans text-xs font-semibold text-zinc-800 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
                    placeholder="name@company.com"
                  />
                  <div className="absolute right-2.5 top-2.5 px-2 py-1 bg-indigo-50 border border-indigo-100  rounded-lg text-[10px] font-bold text-[#3525cd] tracking-wide uppercase">
                    Sync Primary
                  </div>
                </div>
                <p className="font-sans text-[10px] text-zinc-400 font-medium leading-normal">
                  All automated response timers match sent message headers
                  originating from this verified inbox.
                </p>
              </div>

              <div className="flex items-center justify-end border-t border-zinc-50 pt-5 mt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-[#3525cd] hover:bg-[#3525cd]/95 active:scale-[0.98] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all font-sans flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none disabled:opacity-75"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-white" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <Check size={13} className="text-white" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Card 2: Tracking policies and default templates */}
          <section className="bg-white border border-zinc-200/50 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 text-[#3525cd] rounded-xl shrink-0">
                  <Sliders size={18} className="stroke-2.2" />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-[#0b1c30] tracking-tight">
                    Tracking & Reminder Policies
                  </h3>
                  <p className="font-sans text-xs text-zinc-400 mt-0.5">
                    Defiine response SLA periods and prefill automated copy
                    templates.
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-6 p-6">
              {/* core parameters row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SLA tracking period */}
                <div className="space-y-1.5 text-left">
                  <label className="block font-sans text-xs font-bold text-[#0b1c30] tracking-wide uppercase">
                    Default Tracking Window
                  </label>
                  <select
                    value={reminders.defaultDurationDays}
                    onChange={(e) =>
                      setReminders({
                        ...reminders,
                        defaultDurationDays: Number(e.target.value),
                      })
                    }
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-[#3525cd] focus:bg-white focus:outline-none rounded-xl px-4.5 py-3 font-sans text-xs font-bold text-zinc-700 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] cursor-pointer"
                  >
                    <option value={2}>48 Hours (Aggressive SLA)</option>
                    <option value={3}>3 Days (Standard Business)</option>
                    <option value={5}>5 Days (Flexible Loop)</option>
                    <option value={7}>7 Days (1 Calendar Week)</option>
                  </select>
                  <p className="font-sans  text-[10px] text-zinc-400 leading-normal font-medium">
                    Initial deadline automatically assigned to newly tracked
                    sent threads unless customized.
                  </p>
                </div>

                {/* Reminder time selecting */}
                <div className="space-y-1.5 text-left">
                  <label className="block font-sans text-xs font-bold text-[#0b1c30] tracking-wide uppercase">
                    Automated Trigger Window
                  </label>
                  <select
                    value={reminders.triggerHourseBefore}
                    onChange={(e) =>
                      setReminders({
                        ...reminders,
                        triggerHourseBefore: Number(e.target.value),
                      })
                    }
                    className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-[#3525cd] focus:bg-white focus:outline-none rounded-xl px-4.5 py-3 font-sans text-xs font-bold text-zinc-700 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] cursor-pointer"
                  >
                    <option value={12}>12h prior to SLA deadline</option>
                    <option value={24}>24h prior to SLA deadline</option>
                    <option value={48}>48h prior to SLA deadline</option>
                    <option value={0}>At exact deadline expiration</option>
                  </select>
                  <p className="font-sans  text-[10px] text-zinc-400 leading-normal font-medium">
                    When to pre-stage reminder alerts or send automated bump
                    drafts.
                  </p>
                </div>
              </div>

              {/* Template content */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label className="block font-sans text-xs font-bold text-[#0b1c30] tracking-wide uppercase">
                    Default Follow-up Copy Template
                  </label>
                  <span className="font-mono text-[9px] font-bold text-[#3525cd] bg-indigo-50 px-2 py-0.5 rounded">
                    Use variable: {"{name}"}
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={reminders.templateMessage}
                  onChange={(e) =>
                    setReminders({
                      ...reminders,
                      templateMessage: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-50 border border-zinc-200 hover:border-zinc-300 focus:border-[#3525cd] focus:bg-white focus:outline-none rounded-xl p-4 font-sans text-xs font-semibold leading-relaxed text-zinc-700 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
                />
                <p className="font-sans text-[10px] text-zinc-400 leading-normal font-medium">
                  This copy automatically populates as draft text when trigger
                  deadlines approach. Feel free to refine.
                </p>
              </div>

              {/* Toggle Policies */}
              <div className="space-y-3.5 pt-2 border-t border-zinc-50">
                {/* policy 1 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="text-left">
                    <h4 className="font-sans text-xs font-bold text-[#0b1c30]">
                      Auto-Close on Recipient Reply
                    </h4>
                    <p className="font-sans text-[10px] text-zinc-500 font-medium leading-normal mt-0.5">
                      Mark the tracked item as "Completed" immediately when a
                      response lands in your Gmail folder.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setReminders({
                        ...reminders,
                        autoArchiveOnReply: !reminders.autoArchiveOnReply,
                      })
                    }
                    className="text-[#3525cd] hover:text-[#3525cd]/80 transition-colors focus:outline-none cursor-pointer"
                  >
                    {reminders.autoArchiveOnReply ? (
                      <ToggleRight size={38} className="stroke-1.2" />
                    ) : (
                      <ToggleLeft
                        size={38}
                        className="text-zinc-300 stroke-1.2"
                      />
                    )}
                  </button>
                </div>

                {/* policy 2 */}
                <div className="flex items-start justify-between gap-4">
                  <div className="text-left">
                    <h4 className="font-sans text-xs font-bold text-[#0b1c30]">
                      Auto-escalate Overdue Threads
                    </h4>
                    <p className="font-sans text-[10px] text-zinc-500 font-medium leading-normal mt-0.5">
                      Add "URGENT" warning banners to communication items that
                      remain unanswered 48h past deadline.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setReminders({
                        ...reminders,
                        autoEscalateOverdue: !reminders.autoEscalateOverdue,
                      })
                    }
                    className="text-[#3525cd] hover:text-[#3525cd]/80 transition-colors focus:outline-none cursor-pointer"
                  >
                    {reminders.autoArchiveOnReply ? (
                      <ToggleRight size={38} className="stroke-1.2" />
                    ) : (
                      <ToggleLeft
                        size={38}
                        className="text-zinc-300 stroke-1.2"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* button */}
              <div className="flex items-center justify-end border-t border-zinc-50 pt-5 mt-2">
                <button
                  type="submit"
                  disabled={isSavingReminders}
                  className="bg-[#3525cd] hover:bg-[#3525cd]/95  active:scale-[0.98] text-white text-xs font-bold py-2.5 px-5 rounded-xl transition-all font-sans flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none disabled:opacity-70"
                >
                  {isSavingReminders ? (
                    <>
                      <Loader2 size={13} className="animate-spin text-white" />
                      <span>Saving Policies...</span>
                    </>
                  ) : (
                    <>
                      <Check size={13} className="text-white" />
                      <span>Save Tracking Defaults</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* right column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Card 3 */}
          <section className="bg-white border border-zinc-200/50 rounded-2xl shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans text-xs font-extrabold text-[#0b1c30] uppercase tracking-wider">
                Inbox Connection
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>

            <div className="p-3.5  bg-zinc-50 border border-zinc-200/30 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center font-sans text-xs font-black">
                  GM
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-sans text-xs font-bold text-[#0b1c30] truncate leading-tight">
                    Google Mail Link
                  </h4>
                  <p className="font-sans text-[10px] text-zinc-400 truncate leading-none mt-0.5 font-semibold">
                    fuya241@gmail.com
                  </p>
                </div>
              </div>

              <div className="h-px bg-zinc-200/40" />

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                  <span>Authorized Scopes:</span>
                  <span className="text-zinc-700">3 scopes granted</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                    <span>Last Sync Event:</span>
                    <span className="text-zinc-700">4 minute ago</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGmailSync}
              disabled={isSyncinGmail}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-zinc-50 border border-zinc-200/80  rounded-xl text-xs font-bold shadow-2xs transition-all duration-150 cursor-pointer focus:outline-none disabled:opacity-75"
            >
              {isSyncinGmail ? (
                <>
                  <Loader2 size={13} className="animate-spin text-zinc-500" />
                  <span>Syncing folders....</span>
                </>
              ) : (
                <>
                  <RefreshCw size={13} className="text-zinc-400" />
                  <span>Refresh Connection</span>
                </>
              )}
            </button>
          </section>

          {/* Card 4: Notification preferences*/}
          <section className="bg-white border border-zinc-200/50 rounded-2xl shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Bell size={15} className="text-[#3525cd]" />
                <h3 className="font-sans text-xs font-extrabold text-[#0b1c30] uppercase tracking-wider">
                  Notification Rules
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {/* option 1 */}
              <div className="flex items-start justify-between gap-3">
                <div className="text-left">
                  <h4 className="font-sans text-xs font-bold text-[#0b1c30] leading-none">
                    In-App Toast Alerts
                  </h4>
                  <p className="font-sans text-[9px] text-zinc-400 font-medium leading-normal mt-1">
                    Show instant reactive banner alerts when email activity
                    matches tracking patterns.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notification.inAppToasts}
                  onChange={() => toggleNotification("inAppToasts")}
                  className="w-4 h-4 rounded text-[#3525cd] border-zinc-300 focus:ring-[#3525cd] cursor-pointer mt-0.5 shrink-0"
                />
              </div>

              {/* option 2 */}
              <div className="flex items-start justify-between gap-3">
                <div className="text-left">
                  <h4 className="font-sans text-xs font-bold text-[#0b1c30] leading-none">
                    Browser Push Prompts
                  </h4>
                  <p className="font-sans text-[9px] text-zinc-400 font-medium leading-normal mt-1">
                    Allow native browser triggers when active deadlines expire
                    in the background.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notification.browserPush}
                  onChange={() => toggleNotification("browserPush")}
                  className="w-4 h-4 rounded text-[#3525cd] border-zinc-300 focus:ring-[#3525cd] cursor-pointer mt-0.5 shrink-0"
                />
              </div>

              {/* option 3 */}
              <div className="flex items-start justify-between gap-3">
                <div className="text-left">
                  <h4 className="font-sans text-xs font-bold text-[#0b1c30] leading-none">
                    Digest Summary Reports
                  </h4>
                  <p className="font-sans text-[9px] text-zinc-400 font-medium leading-normal mt-1">
                    Receive weekly intelligence emails detailing closed loop
                    rates and recipient bottlenecks.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={notification.weeklyDigest}
                  onChange={() => toggleNotification("weeklyDigest")}
                  className="w-4 h-4 rounded text-[#3525cd] border-zinc-300 focus:ring-[#3525cd] cursor-pointer mt-0.5 shrink-0"
                />
              </div>
            </div>
          </section>

          {/* card 5: Visual mode */}
          <section className="bg-white border border-zinc-200/50 rounded-2xl shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Palette size={15} className="text-[#3525cd]" />
              <h3 className="font-sans text-xs font-extrabold text-[#0b1c30] uppercase tracking-wider">
                Appearance
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "light", label: "Light", active: true, beta: false },
                { id: "dark", label: "Dark", active: false, beta: true },
                { id: "slate", label: "Slate", active: false, beta: true },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => {
                    if (theme.beta) {
                      triggerToast(
                        `${theme.label} theme option is coming soon in the next version update.`,
                        "info",
                      );
                    } else {
                      setActiveTheme(theme.id as any);
                    }
                  }}
                  className={`py-2 px-3 rounded-xl border font-sans text-xs font-bold transition-all  flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none ${
                    activeTheme === theme.id && !theme.beta
                      ? "bg-indigo-50/50 border-[#3525cd] text-[#3525cd] shadow-2xs font-extrabold"
                      : "bg-zinc-50 hover:bg-zinc-100/50 border-zinc-200 text-zinc-500"
                  }`}
                >
                  <span>{theme.label}</span>
                  {theme.beta && (
                    <span className="text-[8px] bg-zinc-200/60 text-zinc-500 px-1 py-0.5 rounded font-extrabold tracking-wide uppercase scale-90">
                      Soon
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* card 6 */}
          <section className="bg-zinc-950 border border-zinc-900 rounded-2xl shadow-md p-6 space-y-4 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Sparkles
                size={15}
                className="text-[#7a6ef5] fill-[#7a6ef5]/15 animate-pulse"
              />
              <h3 className="font-sans text-xs font-extrabold uppercase tracking-wider text-zinc-100">
                Beta Intelligence
              </h3>
            </div>

            <div className="space-y-4">
              {/* feature 1 */}
              <div className="flex gap-3 text-left">
                <div className="p-1.5 bg-zinc-800 text-zinc-400 rounded-lg shrink-0 h-7 w-7 flex items-center justify-center mt-0.5">
                  <Calendar size={13} />
                </div>
                <div>
                  <h4 className="font-sans  text-xs font-bold text-zinc-200 flex items-center gap-1.5 leading-none">
                    Calendar Deadline Sync{" "}
                    <span className="text-[8px] bg-zinc-800 text-zinc-400  px-1 py-0.5 rounded font-extrabold leading-none uppercase">
                      Soon
                    </span>
                  </h4>
                  <p className="font-sans text-[9px] text-zinc-500 leading-normal mt-1">
                    Auto-schedule deadline tracking markers straight into Google
                    Calendar as non-blocking tasks.
                  </p>
                </div>
              </div>

              {/* feature 2 */}
              <div className="flex gap-3 text-left">
                <div className="p-1.5 bg-zinc-800 text-zinc-400  rounded-lg shrink-0 h-7 w-7 flex items-center justify-center mt-0.5">
                  <Inbox size={13} />
                </div>
                <div>
                  <h4 className="font-sans text-xs font-bold text-zinc-200 flex items-center gap-1.5 leading-none">
                    AI Auto-Draft Follow-ups
                    <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded font-extrabold leading-none uppercase">
                      Private Beta
                    </span>
                  </h4>
                  <p className="font-sans text-[9px] text-zinc-500 leading-normal mt-1">
                    Generate context-specific warm bump reminders utilizing
                    server-side Gemini intelligence.
                  </p>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-3.5 mt-2 flex items-center justify-between text-[9px] text-zinc-500 font-bold font-sans">
                <span>ECHO PROTOCOL LABS</span>
                <span>v1.2.0</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
