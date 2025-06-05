import { z } from "zod";

export const playerSchema = z.object({
  id: z.number().int().min(1),
  name: z.string().min(1, "İsim gerekli"),
  age: z.number().min(15).max(50),
  team: z.string().min(1),
  marketValue: z.number().min(0),
});

export type Player = z.infer<typeof playerSchema>;