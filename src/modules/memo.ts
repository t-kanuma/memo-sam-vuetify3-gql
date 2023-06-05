import { getGqlSdk } from "./common";
import {
  CreateMemoInput,
  GetMemosQuery,
  UpdateMemoInput,
} from "@/gql/generated/sdk";

/**
 *
 * @returns
 */
export const getMemos = async (): Promise<GetMemosQuery> => {
  const gqlSdk = await getGqlSdk();
  // GraphQLの場合、エラーの場合もHTTPステータスコードは200で返る。
  // Lib(graphql-request)ボディ上のエラー情報をthrowする実装になっている。
  return await gqlSdk.getMemos({ archived: false });
};

/**
 *
 * @param memo
 * @returns
 */
export const updateMemo = async (memo: UpdateMemoInput): Promise<void> => {
  const gqlSdk = await getGqlSdk();
  const resp = await gqlSdk.updateMemo({ input: memo });
  console.log(resp.updateMemo);
};

/**
 *
 * @param newMemo
 * @returns
 */
export const postMemo = async (newMemo: CreateMemoInput): Promise<void> => {
  const gqlSdk = await getGqlSdk();
  const resp = await gqlSdk.createMemo({ input: newMemo });
  console.log(resp.createMemo);
};
