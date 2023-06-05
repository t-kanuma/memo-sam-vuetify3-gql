import { getGqlSdk } from "./common";
import { GetMemosQuery } from "@/gql/generated/sdk";

/**
 *
 * @returns
 */
export const getArchives = async (): Promise<GetMemosQuery> => {
  const gqlSdk = await getGqlSdk();
  return await gqlSdk.getMemos({ archived: true });
};

/**
 *
 * @param archiveId
 * @returns
 */
export const deleteArchive = async (archiveId: string): Promise<void> => {
  const gqlSdk = await getGqlSdk();
  const resp = await gqlSdk.deleteMemo({ id: archiveId });
  console.log(resp.deleteMemo);
};
