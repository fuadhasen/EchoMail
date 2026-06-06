import { Button, Card, Flex, Link } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";
import type { EmailResponse } from "../entities/EmailResponse";
import useUrlQuery from "../hooks/useUrlQuery";
import ResponseSkeleton from "./ResponseSkeleton";

const Response = () => {
  const query = useUrlQuery();
  const id = query.get("id");

  const markers = ["On ", "Le "];

  const fetchResponses = async () => {
    const res = await axios.get(`http://localhost:8000/email-responses/${id}`);
    return res.data.responses;
  };

  const {
    data: responses,
    error,
    isPending,
  } = useQuery<EmailResponse[], Error>({
    queryKey: ["responses", id],
    queryFn: () => fetchResponses(),
    staleTime: ms("24h"),
  });

  const res = responses?.map((res) => {
    const headers = res.headers;
    const headersJson = JSON.parse(headers.replace(/'/g, '"'));
    const newDate = new Date(headersJson.date);

    const snippet = res.snippet;
    let cutIndex = snippet.length;

    for (const marker of markers) {
      const i = snippet.indexOf(marker);
      if (i !== -1 && i < cutIndex) {
        cutIndex = i;
      }
    }

    res.snippet = snippet.slice(0, cutIndex);
    res["sent_date"] = newDate.toDateString();
    return res;
  });

  if (error) return <p>{error.message}</p>;

  return (
    <>
      {isPending == true ? (
        <ResponseSkeleton />
      ) : (
        <Card className="w-2/3 m-10 space-y-2 bg-gray-400">
          <Flex className="items-center" justify={"between"}>
            <div>
              <p>Subject: {res?.[0]?.subject || "No Subject"}</p>
              <p>
                Thread Id: {res?.[0]?.threadId || "No Response for this Email"}
              </p>
              <p>Total Response: {res?.length}</p>
            </div>
            <Button className="cursor-pointer">
              <Link href={`/track_new?id=${id}`} style={{ all: "unset" }}>
                Track Email
              </Link>
            </Button>
          </Flex>
        </Card>
      )}

      <div className="space-y-6 bg-gray-300 p-4">
        {res?.map((res, index) => (
          <div key={res.id}>
            <Flex justify="between">
              <div className="space-y-4 b">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-800">
                    {res.sender}
                  </span>{" "}
                </div>
                <div className="text-gray-800 whitespace-pre-line">
                  {res.snippet}
                </div>
              </div>
              <p className="mr-10">{res.sent_date}</p>
            </Flex>

            {index !== responses!.length - 1 && (
              <hr className="border-t border-gray-500 mt-4" />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Response;
