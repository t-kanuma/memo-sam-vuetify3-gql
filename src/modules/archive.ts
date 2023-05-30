import { getGqlSdk } from "./common";
import { GetMemosQuery } from "@/gql/generated/sdk";

/**
 *
 * @returns
 */
export const getArchives = async (): Promise<GetMemosQuery> => {
  const gqlSdk = await getGqlSdk();
  try {
    return await gqlSdk.getMemos({ archived: true });
  } catch (e) {
    // TODO: getMemosと同様
    console.log(e);
    throw e;
  }
};

/**
 *
 * @param archiveId
 * @returns
 */
export const deleteArchive = async (archiveId: string): Promise<void> => {
  const gqlSdk = await getGqlSdk();
  try {
    const resp = await gqlSdk.deleteMemo({ id: archiveId });
    console.log(resp.deleteMemo);
  } catch (e) {
    // TODO: getMemosと同様
    console.log(e);
    throw e;
  }
};
