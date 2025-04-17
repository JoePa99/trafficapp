import { z } from 'zod';

export const PlatformType = z.enum(['TV', 'Radio', 'Streaming']);

export const TrafficRowSchema = z.object({
  station: z.string(),
  platform_type: PlatformType,
  market: z.string(),
  isci: z.string(),
  creative_title: z.string(),
  length_secs: z.number().int().positive(),
  flight_start: z.date(),
  flight_end: z.date(),
  rotations: z.string(),
  additional_notes: z.string().optional(),
});

export type TrafficRow = z.infer<typeof TrafficRowSchema>;

// Helper function to extract length from creative title
export const extractLengthFromTitle = (title: string): number | null => {
  const match = title.match(/:(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

// Helper function to parse date strings
export const parseDate = (dateStr: string): Date | null => {
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}; 