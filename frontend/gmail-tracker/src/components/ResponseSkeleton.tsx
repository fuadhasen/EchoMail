import { Card } from "@radix-ui/themes";
import Skeleton from "./Skeleton";

const ResponseSkeleton = () => {
  const responses = [1];

  return (
    <>
      <Card className="w-2/3 m-10 space-y-2 bg-gray-400">
        <div className="flex items-center gap-4">
          <div className="w-2/3">
            <Skeleton width={"90%"} baseColor="#C0C0C0" />
            <Skeleton width={"70%"} baseColor="#C0C0C0" />
            <Skeleton width={"50%"} baseColor="#C0C0C0" />
          </div>
          <div className="w-1/3 relative">
            <Skeleton
              className="left-2/4"
              width={"45%"}
              height={"40%"}
              baseColor="#C0C0C0"
            />
          </div>
        </div>
      </Card>

      <div className="space-y-6 bg-gray-300 p-4">
        {responses.map((res) => (
          <div key={res} className="flex space-y-14 gap-4">
            <div className="w-2/3">
              <Skeleton width={"30%"} baseColor="#C0C0C0" />
              <Skeleton width={"40%"} baseColor="#C0C0C0" />
            </div>
            <div className="w-1/3 relative">
              <Skeleton
                className="left-2/4"
                width={"45%"}
                height={"50%"}
                baseColor="#C0C0C0"
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ResponseSkeleton;
