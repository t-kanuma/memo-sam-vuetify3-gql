import type { MemoArchiveResp } from "@/types";
import { getIdToken } from "@/modules/auth";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "@/gql/generated/sdk";

const client = new GraphQLClient(import.meta.env.VITE_API_BASE_URL);

export const getGqlSdk = async () => {
  client.setHeaders({
    "Content-Type": "application/json",
    Authorization: `Bearer ${await getIdToken()}`,
  });

  return getSdk(client);
};

export const isMemoArchiveResp = (value: unknown): value is MemoArchiveResp => {
  return typeof value === "object" && value !== null && "memos" in value;
};
