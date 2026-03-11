import { PipeTransform } from '@nestjs/common'
import { z } from 'zod'

import type { RefreshTokenRequestDto } from '@interface/dto'
import { parseWithSchema } from '@interface/http/pipes/zod-validation'

const refreshTokenSchema = z
  .object({
    refreshToken: z
      .string({ required_error: 'Refresh token is required' })
      .min(1, 'Refresh token is required')
  })
  .strict()

export class RefreshTokenBodyPipe
  implements PipeTransform<unknown, RefreshTokenRequestDto>
{
  transform(value: unknown): RefreshTokenRequestDto {
    return parseWithSchema(refreshTokenSchema, value)
  }
}
