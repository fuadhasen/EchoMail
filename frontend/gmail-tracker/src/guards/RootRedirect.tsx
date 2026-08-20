import LoadingScreen from "@/components/common/LoadingScreen";
import useAuth from "@/hooks/useAuth";
import Landing from "@/pages/Landing";
import React from "react";
import { Navigate } from "react-router";

const RootRedirect = () => {
  const { status } = useAuth();

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "authenticated") {
    return <Navigate to="/app" replace />;
  }

  return <Landing />;
};

export default RootRedirect;
