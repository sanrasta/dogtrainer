import { z } from "zod";

export const EventFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
   isActive: z.boolean().default(true),
   durationInMinutes: z.coerce.number().int().positive
   ("Duration must be a positive integer").max(60*12, 
    "Duration must be less than 12 hours (720 minutes)"),
    
})