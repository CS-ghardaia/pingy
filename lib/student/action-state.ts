export type ActionState = {
  readonly status: "idle" | "success" | "error";
  readonly message: string;
};

export const initialActionState: ActionState = {
  status: "idle",
  message: "",
};
