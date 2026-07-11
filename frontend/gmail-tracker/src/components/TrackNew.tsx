import { useToast } from "@/context/ToastContext";
import {
  addTrackedEmail,
  getSentEmails,
  type ActivityLog,
  type Recipient,
  type SentEmail,
  type TrackedEmail,
} from "@/data/mockTrackedEmails";
import { ArrowLeft } from "lucide-react";
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
    { num: 1, label: "Select Email" },
    { num: 2, label: "Recipients" },
    { num: 3, label: "Deadline" },
    { num: 4, label: "Review & Start" },
  ];

  return (
    <div className=" w-full text-left px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
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

      {/* steeper progress bar */}
      <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-5 mb-8 shadow-xs">
        steeper progress bar
      </div>

      {/* primary workflow container */}
      <div>primary workflow contianer</div>
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
