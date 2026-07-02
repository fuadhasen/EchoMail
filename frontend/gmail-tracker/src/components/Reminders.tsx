import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import useUrlQuery from "../hooks/useUrlQuery";

const Reminders = () => {
  const query = useUrlQuery();
  const navigate = useNavigate();
  // const email = query.get("email");
  const id = query.get("id");
  const ref = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // const handler = () => {
  //   mutation.mutate();
  // };

  const sendReminders = async () => {
    const data = {
      recipient_emails: [emailRef.current?.value],
      custom_message: ref.current?.value || "",
    };

    const res = await axios.post(
      `http://localhost:8000/tracked-emails/${id}/send-reminders`,
      data,
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationKey: ["reminders"],
    mutationFn: () => sendReminders(),
    onSuccess: () => {
      navigate("/tracked");
    },
    onError: () => {
      console.log("error");
    },
  });

  if (mutation.error)
    return (
      <p className="bg-red-100 m-10 rounded-md p-4">{mutation.error.message}</p>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-white border border-[#c7c4d8]/30 rounded-2xl shadow-xs">
      <div className="p-3 bg-[#eff4ff] text-[#3525cd] rounded-2xl mb-4">
        <CheckCircle2 size={32} className="stroke-[1.5]" />
      </div>
      <h3 className="font-sans text-lg font-bold text-[#0b1c30] mb-2">
        TrackedEmail Section
      </h3>
      <p className="font-sans text-xs text-[#777587] max-w-sm mb-6">
        This panel is on Progress
      </p>
      <button className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 text-xs font-bold py-2.5 px-5 rounded-xl transition-all font-sans cursor-pointer">
        Back to Tracked Emails
      </button>
    </div>
  );
};

export default Reminders;
