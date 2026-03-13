import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { compare } from 'bcrypt'

import { UseCase } from '@repo/kernel'

import { AuthorityEventBusPort, UserPort } from '@domain/ports'
import { AuthorityProvider, Email, Password } from '@domain/value-objects'
import {
  AuthorityFailureReason,
  AuthorityLogEvent,
  hashSensitiveValue,
  logAxiomEvent,
  LogLevel
} from '@infra/axiom/observability'

import {
  AuthorityTokenService,
  type SessionContext
} from '@application/services/authority-token.service'

interface LoginResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class LoginUseCase extends UseCase<
  [email: string, password: string, context: SessionContext],
  LoginResult
> {
  constructor(
    private readonly users: UserPort,
    private readonly tokens: AuthorityTokenService,
    @Inject(AuthorityEventBusPort)
    private readonly events: AuthorityEventBusPort
  ) {
    super()
  }

  async execute(
    email: string,
    password: string,
    context: SessionContext
  ): Promise<LoginResult> {
    const emailVo = Email.create(email)
    const passwordVo = Password.create(password)
    const user = await this.users.findByEmail(emailVo)

    if (!user) {
      void logAxiomEvent({
        event: AuthorityLogEvent.AuthorityLoginFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthorityFailureReason.UserNotFound,
          emailHash: hashSensitiveValue(emailVo.toString())
        }
      })
      throw new UnauthorizedException('Invalid credentials')
    }

    if (user.provider !== AuthorityProvider.Password || !user.hasPassword) {
      void logAxiomEvent({
        event: AuthorityLogEvent.AuthorityLoginFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthorityFailureReason.ProviderMismatch,
          userId: user.idString
        }
      })
      throw new UnauthorizedException('Invalid credentials')
    }

    const ok = await compare(passwordVo.toString(), user.passwordHash)

    if (!ok) {
      void logAxiomEvent({
        event: AuthorityLogEvent.AuthorityLoginFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthorityFailureReason.PasswordMismatch,
          userId: user.idString,
          emailHash: hashSensitiveValue(user.email)
        }
      })
      throw new UnauthorizedException('Invalid credentials')
    }

    const { accessToken, refreshToken, sessionId } =
      await this.tokens.createSession(user, context)

    void this.events
      .emit('authority.user.logged_in', {
        userId: user.idString,
        email: user.email,
        provider: user.provider,
        sessionId,
        ipAddress: context.ipAddress ?? null,
        userAgent: context.userAgent ?? null,
        occurredAt: new Date().toISOString()
      })
      .catch((error) => {
        void logAxiomEvent({
          event: AuthorityLogEvent.AuthorityEventPublishFailed,
          level: LogLevel.Warn,
          context: {
            event: 'authority.user.logged_in',
            errorName: error instanceof Error ? error.name : 'unknown'
          }
        })
      })

    return { accessToken, refreshToken }
  }
}
