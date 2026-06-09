// import { Avatar, Button, DropdownMenu } from "@radix-ui/themes";
// import useProfile from "../hooks/useProfile";
// import axios from "axios";
// import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from "react-router";
// import Spinner from "./Spinner";

// const NavBar = () => {
//   const navigate = useNavigate();
//   const { data } = useProfile();

//   const logOut = () => {
//     mutation.mutate();
//     navigate("/login");
//   };

//   const mutation = useMutation({
//     mutationKey: ["logout"],
//     mutationFn: () => axios.post("http://localhost:8000/logout"),
//     onSuccess: () => {
//       console.log("why is it not redirected to login");
//       navigate("/login");
//     },
//     onError: () => {},
//   });

//   if (mutation.error)
//     return (
//       <p className="p-4 m-10 rounded-md bg-red-100">{mutation.error.message}</p>
//     );

//   return (
//     <div className="p-2">
//       <header className="flex justify-between items-center border-b border-black mb-2">
//         <h2 className="text-2xl ml-5">Dashboard</h2>

//         <DropdownMenu.Root>
//           <DropdownMenu.Trigger>
//             <Avatar
//               src={data?.photos[0].url}
//               variant="solid"
//               fallback="F"
//               className="rounded-full mb-2 mr-10 cursor-pointer text-white font-medium"
//             />
//           </DropdownMenu.Trigger>
//           <DropdownMenu.Content className="space-y-6">
//             <DropdownMenu.Item className="!bg-transparent ">
//               <p className=" text-gray-700 mx-auto">
//                 {data?.emailAddresses[0].value}
//               </p>
//             </DropdownMenu.Item>
//             <DropdownMenu.Item className="!bg-transparent">
//               <Button
//                 onClick={() => logOut()}
//                 className="mx-auto px-20 cursor-pointer"
//                 variant="soft"
//               >
//                 Log out {mutation.isPending && <Spinner />}
//               </Button>
//             </DropdownMenu.Item>
//           </DropdownMenu.Content>
//         </DropdownMenu.Root>
//       </header>
//     </div>
//   );
// };

// export default NavBar;
