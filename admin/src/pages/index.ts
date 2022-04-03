type PageName = "top" | "users" | "summary" | "tsukes";

export interface Page {
  name: PageName;
  label: string;
  path: string;
}

export const PAGES: Page[] = [
  { name: "top", label: "トップ", path: "/" },
  { name: "users", label: "ユーザ", path: "/users" },
  { name: "summary", label: "サマリ", path: "/summary" },
  { name: "tsukes", label: "ツケ一覧", path: "/tsukes" },
];
