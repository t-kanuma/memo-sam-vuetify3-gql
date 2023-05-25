export type Memo = {
  id: string;
  title: string;
  text: string;
  favorite: boolean;
  archived: boolean;
  done: boolean;
};

export type InitMemo = {
  [key in "title" | "text"]: Memo[key];
};

type MemoResp = {
  memos: [];
};

type ArchiveResp = {
  memos: [];
};

export type MemoArchiveResp = MemoResp | ArchiveResp;

// https://stackoverflow.com/questions/73422711/vue3-ts-setup-import-emits-props-type-to-use-with-defineemits-and-defineprops
// export type EmitPattern = {
//   (e: "todoDone", percentage: number): void;
//   (e: "pageName", pageName: string): void;
//   (e: "newMemoCreated"): void;
// };

export type PageName = "メモ" | "アーカイブ";
export type PagePath = "/memos" | "/archives";

export type ValidationRule = (v: string) => boolean | ErrorMessage;

export type ErrorMessage =
  | "必須です"
  | "英字または数字のみにしてください"
  | "8文字以上にしてください"
  | "ログインまたはパスワードに誤りがあります。"
  | "タイトルは必須です。"
  | "タイトルは20文字以内で入力してください。"
  | "本文は必須です。";

export type InfoMessage =
  | "アーカイブしました。"
  | "メモに戻しました。"
  | "このメモは完全に削除されます。よろしいですか？";
// TODO ButtonLabel, Title, Subtitle Labelなど
