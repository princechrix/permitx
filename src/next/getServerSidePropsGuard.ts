import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import type { User } from "../types";

type GuardOptions = {
  requiredRole?: string;
  requiredPermissions?: string[];
  redirect?: string;
};

export const getServerSidePropsGuard = <P extends { [key: string]: any }>(
  guardFn: (ctx: GetServerSidePropsContext) => Promise<User> | User,
  options: GuardOptions
) => {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const user = await guardFn(ctx);

    if (
      (options.requiredRole && user.role !== options.requiredRole) ||
      (options.requiredPermissions &&
        !options.requiredPermissions.every((p) => user.permissions?.includes(p)))
    ) {
      return {
        redirect: {
          destination: options.redirect || "/",
          permanent: false
        }
      };
    }

    return { props: {} as P };
  };
};
