import { useToast } from "@/context/ToastContext";
import { CheckCircle2 } from "lucide-react";
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
      <div>main section grid</div>
    </div>
  );
};

export default Settings;
