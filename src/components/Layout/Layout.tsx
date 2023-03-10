import { PropsWithChildren, useCallback, useEffect } from "react";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/utils";
import useAuth from "@/hooks/useAuth";
import { getMe } from "@/apis/auth";
import { signIn, signOut, useSession } from "next-auth/react";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import Link from "next/link";
import { useRouter } from "next/router";

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  const router = useRouter();
  const { user, clearUser, setUser, setIsFetchingUser } = useAuth();
  const { data: session, status } = useSession();

  const getUser = useCallback(async () => {
    if (!getAccessToken()) {
      setIsFetchingUser(false);
      return;
    }

    try {
      setIsFetchingUser(true);
      const { data } = await getMe();
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error("Fetching user error", error);
    } finally {
      setIsFetchingUser(false);
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
    router.push("/");
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
            <div>
              <Link href="/inventory">
                Inventory
              </Link>
            </div>
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
