import { Select } from "@radix-ui/themes";
import { useNavigate } from "react-router";

const EmailStatusFilter = () => {
  const navigate = useNavigate();

  const fetchEmails = (status: string) => {
    if (status == "all") {
      navigate("/tracked?show_done=true");
    } else {
      navigate("/tracked");
    }
  };

  return (
    <div className="m-10 p-2">
      <Select.Root onValueChange={(status) => fetchEmails(status)} size={"3"}>
        <Select.Trigger placeholder="Filter by Status ..." />

        <Select.Content>
          <Select.Group>
            <Select.Item value="all">all</Select.Item>
            <Select.Item value="pending">Pending</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default EmailStatusFilter;
