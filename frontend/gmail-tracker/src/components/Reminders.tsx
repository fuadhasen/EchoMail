import { Button } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import useUrlQuery from "../hooks/useUrlQuery";
import Spinner from "./Spinner";
import { useRef } from "react";

const Reminders = () => {
  const query = useUrlQuery();
  const navigate = useNavigate();
  const email = query.get("email");
  const id = query.get("id");
  const ref = useRef<HTMLTextAreaElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handler = () => {
    mutation.mutate();
  };

  const sendReminders = async () => {
    const data = {
      recipient_emails: [emailRef.current?.value],
      custom_message: ref.current?.value || "",
    };

    const res = await axios.post(
      `http://localhost:8000/tracked-emails/${id}/send-reminders`,
      data
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
    <>
      <div className="flex flex-col m-10 p-4 space-y-10">
        <div className="flex flex-col space-y-3">
          <label className="font-semibold" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            ref={emailRef}
            type="text"
            placeholder="Enter email ..."
            className="p-3 outline-none w-2/4 rounded-md focus:ring-blue-300"
            defaultValue={email!}
          />
        </div>
        <div className="flex flex-col space-y-3">
          <label className="font-semibold" htmlFor="message">
            Message (Optional)
          </label>
          <textarea
            ref={ref}
            name=""
            id="message"
            className="p-4 h-40 rounded-md outline-none w-2/4"
            placeholder="Enter your message ..."
          ></textarea>
        </div>
      </div>
      <Button
        disabled={mutation.isPending || !id}
        onClick={handler}
        className="mx-14  w-52  cursor-pointer  p-5"
      >
        Send {mutation.isPending && <Spinner />}
      </Button>
    </>
  );
};

export default Reminders;
