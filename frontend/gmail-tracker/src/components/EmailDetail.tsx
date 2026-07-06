import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const EmailDetail = () => {
  // const query = useUrlQuery();
  // const id = query.get("id");
  // const navigate = useNavigate();

  // const { response, data, error, isPending, sent_date, deadline } =
  //   useTrackedDetail(id!);

  // if (error) return <p>{error.message}</p>;
  // if (isPending) return <EmailDetailSkeleton />;

  return <div>the Email Details Page</div>;
};

export default EmailDetail;
