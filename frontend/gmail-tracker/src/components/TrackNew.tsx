import { useToast } from "@/context/ToastContext";
import { getSentEmails, type SentEmail } from "@/data/mockTrackedEmails";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

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

  return <div>Track new emails page</div>;
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
