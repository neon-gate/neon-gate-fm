import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { z } from 'zod'

import { UseCase } from '@repo/kernel'

import { AuthorityEventBusPort, SessionPort } from '@domain/ports'
import { AuthorityProvider } from '@domain/value-objects'
import {
  AuthorityFailureReason,
  AuthorityLogEvent,
  logAxiomEvent,
  LogLevel
} from '@infra/axiom/observability'
import { requireStringEnv } from '@infra/env'
import { DbConfigFlag } from '@infra/db'
import {
  AuthorityTokenService,
  type TokenPayload
} from '@application/services/authority-token.service'

interface RefreshTokenResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class RefreshTokenUseCase extends UseCase<
  [refreshToken: string],
  RefreshTokenResult
> {
  private readonly refreshSecret = requireStringEnv(
    DbConfigFlag.JwtRefreshSecret
  )
  private readonly payloadSchema = z
    .object({
      sub: z.string().min(1),
      email: z.string().email(),
      sid: z.string().min(1),
      provider: z.nativeEnum(AuthorityProvider)
    })
    .strict()

  constructor(
    private readonly sessions: SessionPort,
    private readonly jwt: JwtService,
    private readonly tokens: AuthorityTokenService,
    @Inject(AuthorityEventBusPort)
    private readonly events: AuthorityEventBusPort
  ) {
    super()
  }

  async execute(refreshToken: string): Promise<RefreshTokenResult> {
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(refreshToken, {
        secret: this.refreshSecret
      })
      const parsedPayload = this.payloadSchema.safeParse(payload)
      if (!parsedPayload.success) {
        throw new UnauthorizedException('Refresh token is invalid')
      }
      const typedPayload = parsedPayload.data
      const session = await this.sessions.findById(typedPayload.sid)

      if (!session) {
        void logAxiomEvent({
          event: AuthorityLogEvent.AuthorityRefreshFailed,
          level: LogLevel.Warn,
          context: {
            reason: AuthorityFailureReason.TokenNotFound,
            userId: typedPayload.sub,
            sessionId: typedPayload.sid
          }
        })
        throw new UnauthorizedException('Refresh token is invalid')
      }

      if (session.userId !== typedPayload.sub) {
        throw new UnauthorizedException('Refresh token is invalid')
      }

      if (session.expiresAt.getTime() <= Date.now()) {
        await this.sessions.deleteById(session.idString)
        throw new UnauthorizedException('Refresh token expired')
      }

      const validHash = await compare(refreshToken, session.refreshTokenHash)
      if (!validHash) {
        void logAxiomEvent({
          event: AuthorityLogEvent.AuthorityRefreshFailed,
          level: LogLevel.Warn,
          context: {
            reason: AuthorityFailureReason.TokenHashMismatch,
            userId: typedPayload.sub,
            sessionId: typedPayload.sid
          }
        })
        throw new UnauthorizedException('Refresh token is invalid')
      }

      const { accessToken, refreshToken: rotatedRefreshToken } =
        await this.tokens.rotateSession(typedPayload, session)

      void this.events
        .emit('authority.token.refreshed', {
          userId: typedPayload.sub,
          sessionId: typedPayload.sid,
          occurredAt: new Date().toISOString()
        })
        .catch((error) => {
          void logAxiomEvent({
            event: AuthorityLogEvent.AuthorityEventPublishFailed,
            level: LogLevel.Warn,
            context: {
              event: 'authority.token.refreshed',
              errorName: error instanceof Error ? error.name : 'unknown'
            }
          })
        })

      return { accessToken, refreshToken: rotatedRefreshToken }
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        void logAxiomEvent({
          event: AuthorityLogEvent.AuthorityRefreshFailed,
          level: LogLevel.Warn,
          context: {
            reason: AuthorityFailureReason.TokenVerificationFailed,
            errorName: error instanceof Error ? error.name : 'unknown'
          }
        })
      }
      throw new UnauthorizedException()
    }
  }
}
