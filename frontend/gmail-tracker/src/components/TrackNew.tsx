import { Button, CheckboxCards, Flex } from "@radix-ui/themes";
import { useState, type FormEvent } from "react";
import useUrlQuery from "../hooks/useUrlQuery";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router";
import Spinner from "./Spinner";
import useEmailRecipients from "../hooks/useEmailRecipients";
import TrackNewSkeleton from "./TrackNewSkeleton";

const TrackNew = () => {
  const query = useUrlQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  // find recipients of this email id
  const { data: recipients, isPending, error } = useEmailRecipients(id!);

  const [selected, setSelected] = useState<string[]>([]);

  const sumbitHandler = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const sent_data = {
    recipient_emails: recipients,
    must_respond_emails: selected,
  };

  const mutation = useMutation({
    mutationFn: () =>
      axios.post(`http://localhost:8000/emails/${id}/track`, sent_data),
    onSuccess: () => {
      navigate("/tracked");
    },
    onError: (error: any) => {
      console.log(error.message);
    },
  });

  if (isPending) return <TrackNewSkeleton />;

  if (error)
    return <p className="m-4 p-4 bg-red-100 rounded-md">{error.message}</p>;

  if (mutation.error)
    return <p className="m-10 p-4 bg-red-100 rounded-md">{mutation.error}</p>;

  return (
    <form onSubmit={sumbitHandler}>
      <div className=" bg-white rounded-lg w-2/4 p-4 m-14 space-y-4">
        <h3 className="font-semibold">Select who must respond</h3>
        {recipients?.length > 0 ? (
          <CheckboxCards.Root
            onValueChange={(value) => {
              setSelected(value);
            }}
            value={selected}
            variant="classic"
            size={"2"}
          >
            <Flex gap={"4"} direction={"column"} maxWidth={"100%"}>
              {recipients?.map((email) => (
                <CheckboxCards.Item key={email} value={email}>
                  {email}
                </CheckboxCards.Item>
              ))}
            </Flex>
          </CheckboxCards.Root>
        ) : (
          <p>(No recipients added yet)</p>
        )}
      </div>

      <div className="w-2/4 p-4 m-14 flex justify-end ">
        <Button
          disabled={recipients?.length <= 0 || mutation.isPending}
          className="w-fit  px-14 flex items-center gap-4 cursor-pointer"
        >
          Submit {mutation.isPending && <Spinner />}
        </Button>
      </div>
    </form>
  );
};

export default TrackNew;
