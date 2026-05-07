import { z } from 'zod';
import { TOPIC_CATEGORIES } from './constants';

const localizedStringSchema = z.object({
  fa: z.string().min(1, 'متن فارسی الزامی است'),
  en: z.string().min(1, 'متن انگلیسی الزامی است'),
});

export const LoginSchema = z.object({
  email: z.email('ایمیل نامعتبر است'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
});

export const CountrySchema = z.object({
  name: localizedStringSchema,
  slug: z.string().min(1, 'اسلاگ الزامی است').regex(/^[a-z0-9-]+$/, 'اسلاگ فقط شامل حروف کوچک، اعداد و خط تیره باشد'),
  flag: z.string().min(1, 'پرچم الزامی است'),
  abstract: localizedStringSchema,
  population: z.number().min(0, 'جمعیت باید عدد مثبت باشد'),
  countryCode: z.string().min(2, 'کد کشور الزامی است').max(3),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  podcastUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
});

export const TopicSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().min(1, 'اسلاگ الزامی است').regex(/^[a-z0-9-]+$/, 'اسلاگ نامعتبر'),
  description: localizedStringSchema,
  category: z.enum(TOPIC_CATEGORIES),
  order: z.number().int().min(0),
});

export const CommentActionSchema = z.object({
  commentId: z.string().min(1),
  action: z.enum(['approve', 'reject', 'delete']),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type CountryInput = z.infer<typeof CountrySchema>;
export type TopicInput = z.infer<typeof TopicSchema>;
export type CommentActionInput = z.infer<typeof CommentActionSchema>;
