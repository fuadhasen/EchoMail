import { Button } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useUrlQuery from "../hooks/useUrlQuery";
import Spinner from "./Spinner";
import { useNavigate } from "react-router";

interface Props {
  status: boolean;
}

const MarkButton = ({ status }: Props) => {
  const query = useUrlQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  const markHandler = () => {
    mutation.mutate();
  };

  const unMarkHandler = () => {
    mutation2.mutate();
  };

  const mark = async () => {
    const res = await axios.post(
      `http://localhost:8000/tracked-emails/${id}/mark-done`
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationKey: ["done"],
    mutationFn: () => mark(),
    onSuccess: () => {
      navigate("/tracked");
    },
  });

  const unmark = async () => {
    const res = await axios.post(
      `http://localhost:8000/tracked-emails/${id}/mark-undone`
    );
    return res.data;
  };

  const mutation2 = useMutation({
    mutationKey: ["done"],
    mutationFn: () => unmark(),
    onSuccess: () => {
      navigate("/tracked");
    },
  });

  return (
    <div className="m-10 flex  space-x-10 ">
      <Button
        disabled={mutation.isPending || status}
        onClick={markHandler}
        variant="soft"
      >
        Mark as done {mutation.isPending && <Spinner />}
      </Button>
      <Button
        disabled={mutation2.isPending || status == false}
        onClick={unMarkHandler}
        variant="soft"
      >
        Mark as undone {mutation2.isPending && <Spinner />}
      </Button>
    </div>
  );
};

export default MarkButton;
