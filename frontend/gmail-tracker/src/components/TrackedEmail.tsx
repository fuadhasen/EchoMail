import { Link, Table } from "@radix-ui/themes";
import useTrackedEmails from "../hooks/useTrackedEmails";
import useUrlQuery from "../hooks/useUrlQuery";
import EmailStatusFilter from "./EmailStatusFilter";
import TrackedSkeleton from "./TrackedSkeleton";

const TrackedEmail = () => {
  const query = useUrlQuery();
  const show_done = query.get("show_done");

  let url = "";
  if (show_done) {
    url = "http://localhost:8000/tracked-emails?show_done=true";
  } else {
    url = "http://localhost:8000/tracked-emails";
  }

  const { res, error, isPending } = useTrackedEmails(url);
  const result = res?.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <EmailStatusFilter />
      {isPending ? (
        <TrackedSkeleton />
      ) : (
        <Table.Root className="m-10 w-2/3">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>
                Subject tracked emails
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>deadline</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>is_done</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {result?.map((email) => (
              <Table.Row key={email.id}>
                <Table.Cell>
                  <Link href={`/tracked/detail?id=${email.id}`}>
                    {email.subject}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  {email.is_done
                    ? "completed"
                    : parseInt(email.time_left) <= 0
                    ? "deadline Passed"
                    : email.time_left + " day(s) left"}
                </Table.Cell>
                <Table.Cell>
                  {email.is_done == true ? "true" : "false"}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
};

export default TrackedEmail;
