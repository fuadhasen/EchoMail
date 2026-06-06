import Skeleton from "./Skeleton";

const HomeSkeleton = () => {
  return (
    <div className="m-14 px-6 max-w-6xl">
      <div className="grid grid-col-1 gap-2">
        <div className=" bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
          <div className="">
            <Skeleton width={"70%"} />
          </div>
          <div>
            <p>
              <Skeleton width={"30%"} />
            </p>
            <p>
              <Skeleton width={"30%"} />
            </p>
            <p>
              <Skeleton width={"30%"} />
            </p>
          </div>
          <br />
          <hr />
          <div className="mt-4 rounded-lg">
            <Skeleton width={"90%"} height="50px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSkeleton;
