import LoadingScreen from "@/components/common/LoadingScreen";
import { useToast } from "@/context/ToastContext";
import useAuth from "@/hooks/useAuth";
import { getSettings, updateSettings } from "@/services/settings";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";

interface ReminderSettings {
  templateMessage: string;
}

const Settings = () => {
  const { triggerToast } = useToast();

  const { user } = useAuth();

  const [isSaving, setIsSaving] = useState(false);
  const [isSyncingGmail, setIsSyncingGmail] = useState(false);

  const [notifyOnResponse, setNotifyOnResponse] = useState(true);
  // reminder preference state
  const [reminders, setReminder] = useState<ReminderSettings>({
    templateMessage: "",
  });

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  useEffect(() => {
    if (settings) {
      setNotifyOnResponse(settings.notify_on_response);
      setReminder((prev) => ({
        ...prev,
        templateMessage: settings.reminder_template,
      }));
    }
  }, [settings, setNotifyOnResponse]);

  const { mutateAsync: saveSettings } = useMutation({
    mutationFn: updateSettings,
  });

  if (isLoadingSettings) return <LoadingScreen />;

  // handle gmail reconnect
  const handleReconnectGmail = () => {
    if (isSyncingGmail) return;
    setIsSyncingGmail(true);
    setTimeout(() => {
      setIsSyncingGmail(false);
      triggerToast("Gmail connection refreshed successfully.", "success");
    }, 1000);
  };

  // handle save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await saveSettings({
        notify_on_response: notifyOnResponse,
        reminder_template: reminders.templateMessage,
      });

      setIsSaving(false);
      triggerToast("Settings saved successfully.", "success");
    } catch (error) {
      console.error("Failed to save settings:", error);

      setIsSaving(false);
      triggerToast("Failed to save settings.", "info");
    }
  };
  // w-full max-w-7xl px-2 sm:px-4 text-left py-4 space-y-8
  return (
    <div className=" w-full  text-left px-4 md:px-8 py-4 space-y-6">
      {/* page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Settings
          </h1>
          <p className="font-sans text-sm text-slate-500 mt-1">
            Manage your profile, connected Gmail account, and default follow-up
            preferences.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* left column: Account and Gmail connection */}
          <div className="lg:col-span-5 space-y-8">
            {/* Account section */}
            <section className="space-y-3">
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                Account
              </h2>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Full Name
                  </label>
                  <p
                    className="w-full bg-slate-50/80 border border-slate-200
                  focus:border-[#3525cd] focus:bg-white focus:outline-none
                  rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900
                  font-medium transition-colors"
                  >
                    {user?.name || ""}
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Email Address
                  </label>
                  <div
                    className="w-full bg-slate-50/80 border border-slate-200
                  focus:border-[#3525cd] focus:bg-white focus:outline-none
                  rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-900
                  font-medium transition-colors"
                  >
                    {user?.email || ""}
                  </div>
                </div>
              </div>
            </section>

            {/* Gmail connection section */}
            <section className="space-y-3">
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                Gmail Connection
              </h2>
              <div className="bg-white border  border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-[#3525cd] flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                      GM
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {user?.email || ""}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Connected
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReconnectGmail}
                    disabled={isSyncingGmail}
                    className="shrink-0 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60 focus:outline-none"
                  >
                    <RefreshCw
                      size={14}
                      className={`text-slate-500 ${isSyncingGmail ? "animate-spin" : ""}`}
                    />
                    <span>
                      {isSyncingGmail ? "Reconnecting..." : "Reconnect"}
                    </span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 font-sans leading-relaxed border-t border-slate-100 pt-3">
                  EchoMail automatically track sent threads and incoming
                  recipient replies for this Gmail inbox.
                </p>
              </div>
            </section>
          </div>

          {/* right column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Reminder preference section */}
            <section className="space-y-3">
              <h2 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                Reminder Preferences
              </h2>
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-5">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="pt-2 w-full">
                    <label className="flex items-center gap-3 cursor-pointer p-3.5 bg-slate-50/80 border border-slate-200/80 rounded-xl">
                      <input
                        type="checkbox"
                        checked={notifyOnResponse}
                        onChange={(e) => setNotifyOnResponse(e.target.checked)}
                        className="w-4 h-4 rounded text-[#3525cd] focus:ring-[#3525cd]/20 cursor-pointer"
                      />
                      <div className="text-left">
                        <span className="text-xs font-bold text-[#0b1c30] block font-mono">
                          Instant Desktop Notifications
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                    Default Reminder Template
                  </label>
                  <textarea
                    rows={4}
                    value={reminders.templateMessage}
                    onChange={(e) =>
                      setReminder({
                        ...reminders,
                        templateMessage: e.target.value,
                      })
                    }
                    className="w-full h-40 bg-slate-50/80 border border-slate-200 focus:border-[#3525cd] rounded-xl p-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans transition-colors resize-none"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#3525cd] hover:bg-[#281ca8] text-white text-xs sm:text-sm font-bold py-2 px-4 rounded-xl transition-colors font-sans flex items-center gap-2 cursor-pointer shadow-2xs focus:outline-none disabled:opacity-75"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin text-white" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check size={15} className="text-white" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Settings;
