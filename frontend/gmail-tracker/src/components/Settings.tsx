import { useToast } from "@/context/ToastContext";
import { Check, CheckCircle2, Loader2, Sliders, User } from "lucide-react";
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

    // quick save switches instantly
    const toggleNotification = (key: keyof NotificationSettings) => {
      const updated = { ...notification, [key]: !notification[key] };
      setNotification(updated);
      localStorage.setItem("echomail_notification", JSON.stringify(updated));
      triggerToast("Notification preferences updated.", "success");
    };
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
              <div>template content</div>

              {/* Toggle Policies */}
              <div>toggle policies</div>

              {/* button */}
              <div>button</div>
            </form>
          </section>
        </div>

        {/* right column */}
        <div>right column</div>
      </div>
    </div>
  );
};

export default Settings;
