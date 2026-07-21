import { Card, Table } from "@radix-ui/themes";
import Skeleton from "./Skeleton";

const EmailDetailSkeleton = () => {
  const emails = [1, 2, 3];
  return (
    <div className="space-y-10">
      <Card className="m-10 p-4 w-2/4 space-y-2 bg-gray-400">
        <div className="w-2/3">
          <Skeleton width={"90%"} baseColor="#C0C0C0" />
          <br />
          <Skeleton width={"65%"} baseColor="#C0C0C0" />
          <Skeleton width={"60%"} baseColor="#C0C0C0" />
          <Skeleton width={"40%"} baseColor="#C0C0C0" />
        </div>
      </Card>
      <Table.Root className="m-10 w-2/3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Recipients</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Required</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Responded</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>last_reminder</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>send_reminder</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {emails?.map(() => (
            <Table.Row>
              <Table.RowHeaderCell>
                <Skeleton baseColor="#dcdcdc" />
              </Table.RowHeaderCell>
              <Table.Cell>
                <Skeleton baseColor="#dcdcdc" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton baseColor="#dcdcdc" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton baseColor="#dcdcdc" />
              </Table.Cell>
              <Table.Cell>
                <Skeleton baseColor="#dcdcdc" />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default EmailDetailSkeleton;
