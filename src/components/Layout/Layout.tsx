import { PropsWithChildren, useCallback, useEffect } from "react";
import { clearAccessToken, setAccessToken } from "@/utils";
import useAuth from "@/hooks/useAuth";
import { getMe } from "@/apis/auth";
import { signIn, signOut, useSession } from "next-auth/react";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  const { user, clearUser, setUser } = useAuth();
  const { data: session, status } = useSession();

  const getUser = useCallback(async () => {
    const { data } = await getMe();
    if (data) {
      setUser(data);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [setUser]);

  useIsomorphicLayoutEffect(() => {
    if (
      session &&
      "accessToken" in session &&
      session?.accessToken &&
      status === "authenticated"
    ) {
      setAccessToken(String(session.accessToken));
      signOut({ redirect: false });
      getUser();
    }
  }, [session, status, getUser]);

  const logout = () => {
    clearAccessToken();
    clearUser();
  };

  return (
    <>
      <div>
        {/* <div>Pokecase</div> */}
        {user?.id && (
          <div>
            <div>{user?.name}</div>
            <div>${user?.coin}</div>
            <div>Xp: {user?.xp}</div>
            <button onClick={logout}>Logout</button>
          </div>
        )}
        {!user?.id && <button onClick={() => signIn()}>Login</button>}
      </div>
      <div>{children}</div>
    </>
  );
};

export default Layout;
