import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useParams } from "react-router";
dayjs.extend(relativeTime);

const EmailDetail = () => {
  // const query = useUrlQuery();
  // const id = query.get("id");
  // const navigate = useNavigate();

  // const { response, data, error, isPending, sent_date, deadline } =
  //   useTrackedDetail(id!);

  // if (error) return <p>{error.message}</p>;
  // if (isPending) return <EmailDetailSkeleton />;

  const { id } = useParams();

  return <div>The emails detail page for the Id: {id}</div>;
};

export default EmailDetail;
