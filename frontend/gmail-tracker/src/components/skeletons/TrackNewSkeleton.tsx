import { CheckboxCards, Flex } from "@radix-ui/themes";
import Skeleton from "./Skeleton";

const TrackNewSkeleton = () => {
  const recipients = [1, 2, 3];

  return (
    <form>
      <div className=" bg-white rounded-lg w-2/4 p-4 m-14 space-y-4">
        <h3 className="font-semibold">Select who must respond</h3>
        {recipients?.length > 0 ? (
          <CheckboxCards.Root variant="classic" size={"2"}>
            <Flex gap={"4"} direction={"column"} maxWidth={"100%"}>
              {recipients?.map(() => (
                <Skeleton />
              ))}
            </Flex>
          </CheckboxCards.Root>
        ) : (
          <p>(No recipients added yet)</p>
        )}
      </div>

      <div className="w-2/4 p-4 m-14 flex justify-end ">
        <div className="w-1/3 text-end p-2">
          <Skeleton width={"65%"} height={"25px"} baseColor="#C0C0C0" />
        </div>
      </div>
    </form>
  );
};

export default TrackNewSkeleton;
