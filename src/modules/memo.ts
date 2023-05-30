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
  try {
    return await gqlSdk.getMemos({ archived: false });
  } catch (e) {
    // TODO: GraphQLの場合、HTTPステータスコードはエラーの場合も200で返る。
    // ボディ上のエラー情報をLibがthrowすると考える。
    // ここではその内容を見てみる。
    console.log(e);
    throw e;
  }
};

/**
 *
 * @param memo
 * @returns
 */
export const updateMemo = async (memo: UpdateMemoInput): Promise<void> => {
  const gqlSdk = await getGqlSdk();
  try {
    const resp = await gqlSdk.updateMemo({ input: memo });
    console.log(resp.updateMemo);
  } catch (e) {
    // TODO: getMemosと同様
    console.log(e);
    throw e;
  }
};

/**
 *
 * @param newMemo
 * @returns
 */
export const postMemo = async (newMemo: CreateMemoInput): Promise<void> => {
  const gqlSdk = await getGqlSdk();
  try {
    const resp = await gqlSdk.createMemo({ input: newMemo });
    console.log(resp.createMemo);
  } catch (e) {
    // TODO: getMemosと同様
    console.log(e);
    throw e;
  }
};
