import useSWR, { ConfigInterface } from "swr";
import { AuthorizationService } from "services";

const authService = new AuthorizationService();

function useLoginStatus(opts?: ConfigInterface): any {
  const { data, error, mutate } = useSWR(
    `/users/me`,
    async () => {
      const res = await authService.getUsersData();
      return res;
    },
    {
      ...opts,
      revalidateOnFocus: false,
    }
  );

  return {
    loginStatus: error
      ? ("loggedOut" as const)
      : !data
      ? ("loading" as const)
      : ("loggedIn" as const),
    user: data,
    mutate,
  };
}

export default useLoginStatus;
