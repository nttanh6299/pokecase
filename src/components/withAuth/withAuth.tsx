import React from "react";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";

function withAuth<T>(WrappedComponent: React.ComponentType<T>) {
  const WithAuthComponent = (props: T): React.ReactNode => {
    const router = useRouter();
    const { user, isFetchingUser } = useAuth();

    if (isFetchingUser) return null;

    if (!isFetchingUser && !user) {
      router.replace("/");
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
}

export default withAuth;
