import { z } from "zod";

export const getListSchema = z.object({
  id: z.uuid(),
});
