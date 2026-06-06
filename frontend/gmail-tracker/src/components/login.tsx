import { Heading } from "@radix-ui/themes";
import { FcGoogle } from "react-icons/fc";

const LoginWithHandler = () => {
  const scopes = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const loginHandler = () => {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: import.meta.env.VITE_CLIENT_ID!,
      redirect_uri: import.meta.env.VITE_REDIRECT_URI!,
      scope: scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <>
      <div className="flex items-center min-h-screen  bg-gray-50">
        <div className="w-1/3 h-96 mx-auto  text-center">
          <div className="flex justify-center">
            <div className="flex items-center justify-center rounded-full w-16 h-16 bg-indigo-600 text-white font-semibold text-xl">
              <span className="">F</span>
            </div>
          </div>
          <div className="p-4 space-y-1 mb-3">
            <Heading className="font-extrabold text-gray-900">
              Welcome to Gmail Tracker
            </Heading>
            <p className="text-sm text-gray-700">
              Securely sign in with your Google account
            </p>
          </div>
          <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white px-8 py-8 border border-gray-100 shadow-sm rounded-md">
            <div className="mt-6">
              <button
                onClick={loginHandler}
                className="inline-flex items-center mx-auto gap-2 justify-center px-24 py-3 rounded-md border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50"
              >
                <span>
                  <FcGoogle size={"20"} />
                </span>
                <span className="text-sm text-gray-700 font-medium">
                  Continue with Google
                </span>
              </button>
              <p className="p-4 text-xs">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginWithHandler;
