import { Box, Link, Table } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import { MdSearch } from "react-icons/md";
import axios from "axios";
import ms from "ms";
import React, { useRef, useState } from "react";
import EmailSkeleton from "./EmailSkeleton";
import type { SentEmailEntity } from "../entities/SentEmailEntity";

const SentEmail = () => {
  // call the backend and get list of sent emails
  const ref = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEmails = async (term: string) => {
    const res = await axios.get(
      `http://localhost:8000/search-sent-emails?search_term=${term || ""}`
    );

    return res.data.emails;
  };

  const {
    data: emails,
    error,
    isPending,
  } = useQuery<SentEmailEntity[], Error>({
    queryKey: ["sent-emails", searchTerm],
    queryFn: () => fetchEmails(searchTerm),
    staleTime: ms("24h"),
    enabled: !!searchTerm,
  });

  const searchHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (ref.current) {
      setSearchTerm(ref.current.value || "");
    }
  };

  if (error)
    return <p className="bg-red-100 p-4 m-10 rounded-md">{error.message}</p>;

  return (
    <>
      <Box className="relative w-2/3 m-14">
        <form onSubmit={searchHandler}>
          <input
            ref={ref}
            className="w-full p-3 pl-10 pr-4  rounded-full border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 outline-none"
            type="text"
            placeholder="search sent emails and press enter ..."
          />
          <MdSearch
            size={22}
            className=" absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
          />
        </form>
      </Box>

      {isPending == true && searchTerm ? (
        <EmailSkeleton />
      ) : (
        <Table.Root variant="surface" className=" m-14 mt-14 w-2/3">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>To:</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {emails?.map((email) => (
              <Table.Row key={email.id}>
                <Table.RowHeaderCell>
                  <Link
                    href={`response?id=${email.id}`}
                    className="text-gray-800 hover:text-blue-500 hover:underline cursor-pointer"
                  >
                    {email.subject}
                  </Link>
                </Table.RowHeaderCell>
                <Table.Cell>{email.recipients[0]},...</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </>
  );
};

export default SentEmail;
