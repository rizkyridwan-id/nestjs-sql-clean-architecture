import { SortOrder } from 'mongoose';
import * as z from 'zod';

export type GetPaginationDto = z.infer<typeof GetPaginationDto> & {
  sort_by?: SortOrder;
};

export const GetPaginationDto = z.object({
  skip: z
    .string()
    .regex(/\d+/, { message: 'Format skip tidak valid' })
    .optional(),
  limit: z
    .string()
    .regex(/\d+/, { message: 'Format limit tidak valid' })
    .optional(),
  first: z.enum(['true', 'false']).optional(),
  sort_by: z
    .record(z.enum(['asc', 'ascending', 'desc', 'descending']))
    .optional(),
});
