import { v4 as uuid } from "uuid";

export type Id = string & { _kind: "id" };
export const createId = (): Id => uuid() as Id;
