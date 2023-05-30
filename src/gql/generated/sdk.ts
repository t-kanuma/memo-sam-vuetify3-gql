import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateMemoInput = {
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Memo = {
  __typename?: 'Memo';
  archived: Scalars['Boolean']['output'];
  done: Scalars['Boolean']['output'];
  favorite: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createMemo?: Maybe<Scalars['String']['output']>;
  deleteMemo?: Maybe<Scalars['String']['output']>;
  updateMemo?: Maybe<Scalars['String']['output']>;
};


export type MutationCreateMemoArgs = {
  memo: CreateMemoInput;
};


export type MutationDeleteMemoArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateMemoArgs = {
  memo: UpdateMemoInput;
};

export type Query = {
  __typename?: 'Query';
  memos: Array<Memo>;
};


export type QueryMemosArgs = {
  archived?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateMemoInput = {
  archived: Scalars['Boolean']['input'];
  done: Scalars['Boolean']['input'];
  favorite: Scalars['Boolean']['input'];
  id: Scalars['String']['input'];
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type GetMemosQueryVariables = Exact<{
  archived: Scalars['Boolean']['input'];
}>;


export type GetMemosQuery = { __typename?: 'Query', memos: Array<{ __typename?: 'Memo', archived: boolean, done: boolean, favorite: boolean, id: string, text: string, title: string }> };

export type CreateMemoMutationVariables = Exact<{
  input: CreateMemoInput;
}>;


export type CreateMemoMutation = { __typename?: 'Mutation', createMemo?: string | null };

export type UpdateMemoMutationVariables = Exact<{
  input: UpdateMemoInput;
}>;


export type UpdateMemoMutation = { __typename?: 'Mutation', updateMemo?: string | null };

export type DeleteMemoMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteMemoMutation = { __typename?: 'Mutation', deleteMemo?: string | null };


export const GetMemosDocument = gql`
    query getMemos($archived: Boolean!) {
  memos(archived: $archived) {
    archived
    done
    favorite
    id
    text
    title
  }
}
    `;
export const CreateMemoDocument = gql`
    mutation createMemo($input: CreateMemoInput!) {
  createMemo(memo: $input)
}
    `;
export const UpdateMemoDocument = gql`
    mutation updateMemo($input: UpdateMemoInput!) {
  updateMemo(memo: $input)
}
    `;
export const DeleteMemoDocument = gql`
    mutation deleteMemo($id: String!) {
  deleteMemo(id: $id)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getMemos(variables: GetMemosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetMemosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetMemosQuery>(GetMemosDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getMemos', 'query');
    },
    createMemo(variables: CreateMemoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateMemoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMemoMutation>(CreateMemoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createMemo', 'mutation');
    },
    updateMemo(variables: UpdateMemoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateMemoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateMemoMutation>(UpdateMemoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateMemo', 'mutation');
    },
    deleteMemo(variables: DeleteMemoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteMemoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteMemoMutation>(DeleteMemoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteMemo', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;