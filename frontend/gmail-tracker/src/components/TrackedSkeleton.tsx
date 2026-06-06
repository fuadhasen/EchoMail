import { Table } from "@radix-ui/themes";
import Skeleton from "./Skeleton";

const TrackedSkeleton = () => {
  const emails = [1, 2, 3];
  return (
    <Table.Root className="m-10 w-2/3">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            Subject for tracked emails
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>deadline</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>is_done</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {emails?.map((email) => (
          <Table.Row key={email}>
            <Table.RowHeaderCell>
              <Skeleton baseColor="#dcdcdc" />
            </Table.RowHeaderCell>
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
  );
};

export default TrackedSkeleton;
