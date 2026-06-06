import { Table } from "@radix-ui/themes";
import Skeleton from "./Skeleton";

const EmailSkeleton = () => {
  const emails = [1, 2, 3, 4];
  return (
    <>
      <Table.Root variant="surface" className=" m-14 mt-14 w-2/3">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>To:</Table.ColumnHeaderCell>
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
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default EmailSkeleton;
