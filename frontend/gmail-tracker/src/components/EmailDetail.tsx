import { Badge, Button, Card, Table, Text } from "@radix-ui/themes";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router";
import useTrackedDetail from "../hooks/useTrackedDetail";
import useUrlQuery from "../hooks/useUrlQuery";
import EmailDetailSkeleton from "./EmailDetailSkeleton";
import MarkButton from "./MarkButton";
dayjs.extend(relativeTime);

const EmailDetail = () => {
  const query = useUrlQuery();
  const id = query.get("id");
  const navigate = useNavigate();

  const { response, data, error, isPending, sent_date, deadline } =
    useTrackedDetail(id!);

  if (error) return <p>{error.message}</p>;
  if (isPending) return <EmailDetailSkeleton />;

  return (
    <div className="space-y-10 p-2">
      <Card className="flex flex-col m-10 p-4 w-2/4 space-y-2 bg-gray-400">
        <Text>
          <span className="font-semibold">Subject</span>: {data?.subject}
        </Text>
        <br />
        <Text>
          <span className="font-semibold">Sent</span>: {sent_date}
        </Text>
        <Text>
          <span className="font-semibold">Deadline</span>: {deadline}
        </Text>
        <Text>
          <span className="font-semibold">Status</span>:{" "}
          {data?.is_done == true ? "done" : "not done"}
        </Text>
      </Card>
      <div className="space-y-20">
        <Table.Root className=" m-10 w-2/3">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Recipients</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Must Respond</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Responded</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>last_reminder</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>send_reminder</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {response?.map((res) => (
              <Table.Row className="">
                <Table.Cell>{res.email}</Table.Cell>
                <Table.Cell className="relative">
                  {res.must_respond == "1" ? (
                    <Badge size={"3"} color="green">
                      <Check size={16} />
                    </Badge>
                  ) : (
                    <Badge size={"3"} color="red">
                      <X size={16} />
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell className="relative">
                  {res.has_responded == "1" ? (
                    <Badge size={"3"} color="green">
                      <Check size={16} />
                    </Badge>
                  ) : (
                    <Badge size={"3"} color="red">
                      <X size={16} />
                    </Badge>
                  )}
                </Table.Cell>
                <Table.Cell className="relative">
                  {res.last_reminder || "__"}
                </Table.Cell>
                <Table.Cell className="relative">
                  <Button
                    onClick={() => {
                      navigate(`/reminders?id=${id}&email=${res.email}`);
                    }}
                  >
                    Send Reminder
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
        <div>
          <MarkButton status={data!.is_done} />
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
