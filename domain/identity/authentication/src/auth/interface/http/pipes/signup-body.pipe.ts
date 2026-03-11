import { PipeTransform } from '@nestjs/common'
import { z } from 'zod'

import type { SignupRequestDto } from '@interface/dto'
import { parseWithSchema } from '@interface/http/pipes/zod-validation'

const signupSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Email must be valid'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters'),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .optional()
      .nullable()
  })
  .strict()

export class SignupBodyPipe
  implements PipeTransform<unknown, SignupRequestDto>
{
  transform(value: unknown): SignupRequestDto {
    return parseWithSchema(signupSchema, value)
  }
}
