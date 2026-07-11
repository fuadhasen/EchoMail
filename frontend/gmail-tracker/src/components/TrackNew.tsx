const TrackNew = () => {
  // const query = useUrlQuery();
  // const id = query.get("id");
  // const navigate = useNavigate();

  // // find recipients of this email id
  // const { data: recipients, isPending, error } = useEmailRecipients(id!);

  // const [selected, setSelected] = useState<string[]>([]);

  // const sumbitHandler = (e: FormEvent) => {
  //   e.preventDefault();
  //   mutation.mutate();
  // };

  // const sent_data = {
  //   recipient_emails: recipients,
  //   must_respond_emails: selected,
  // };

  // const mutation = useMutation({
  //   mutationFn: () =>
  //     axios.post(`http://localhost:8000/emails/${id}/track`, sent_data),
  //   onSuccess: () => {
  //     navigate("/tracked");
  //   },
  //   onError: (error: any) => {
  //     console.log(error.message);
  //   },
  // });

  // if (isPending) return <TrackNewSkeleton />;

  // if (error)
  //   return <p className="m-4 p-4 bg-red-100 rounded-md">{error.message}</p>;

  // if (mutation.error)
  //   return <p className="m-10 p-4 bg-red-100 rounded-md">{mutation.error}</p>;

  return <div>The track new sent emails page</div>;
};

export default TrackNew;
