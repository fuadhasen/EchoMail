import { Heading } from "@radix-ui/themes";
import useTrackedEmails from "../hooks/useTrackedEmails";
import HomeSkeleton from "./HomeSkeleton";

const Home = () => {
  const url = "http://localhost:8000/tracked-emails?show_done=true";
  const { res, error, isPending } = useTrackedEmails(url);
  const result = res?.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  if (error)
    return <p className="bg-red-100 p-4 m-10 rounded-md">{error.message}</p>;

  if (isPending) return <HomeSkeleton />;

  return (
    <div className="m-14 px-6 max-w-6xl">
      <div className="grid grid-col-1 gap-2">
        {res?.length == 0 && "Empty Tracked Emails"}
        <ul>
          {result?.slice(0, 2).map((email) => (
            <div className=" bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
              <div className="flex justify-between mb-2">
                <Heading>{email.subject}</Heading>
                <span className="text-blue-700 text-sm rounded-full bg-blue-100  font-medium px-5 py-1">
                  {email.is_done
                    ? "completed"
                    : parseInt(email.time_left) <= 0
                      ? "deadline Passed"
                      : email.time_left + " day(s) left"}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">From: {email.sender}</p>
                <p className="text-sm text-gray-500">Sent: {email.sent_date}</p>
                <p className="text-sm text-gray-500">
                  Deadline: {email.deadline}
                </p>
              </div>
              <hr />
              <div className="mt-4">
                <h4 className="font-medium text-lg mb-2">Recipients</h4>
                <ul className="w-full">
                  {email.recipients.slice(0, 1).map((recipient) => (
                    <li className="flex  items-center justify-between bg-gray-50 border border-gray-200 px-3 py-3 rounded-xl mb-2">
                      <div>
                        <p className="font-medium text-gray-700">
                          {recipient.email}
                        </p>
                        <p>
                          {recipient.has_responded ? (
                            <span className="text-sm text-gray-500">
                              ✅ Responded
                              <span className="ml-2 text-gray-400">
                                • Last reminder: {recipient.last_reminder}
                              </span>
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Not Responded
                              <span className="ml-2 text-gray-400">
                                • Last reminder:{" "}
                                {recipient.last_reminder == "__"
                                  ? "Not sent"
                                  : recipient.last_reminder}
                              </span>
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-xs text-yellow-800 rounded-full px-3 py-1">
                        {"Must Respond"}
                      </span>
                    </li>
                  ))}
                </ul>
                {email.recipients.length > 2 && (
                  <li className="ml-2 text-gray-400 text-sm">...</li>
                )}
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
