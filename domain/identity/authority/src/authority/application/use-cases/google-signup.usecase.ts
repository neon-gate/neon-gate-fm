import { ConflictException, Inject, Injectable } from '@nestjs/common'

import { UseCase } from '@repo/kernel'

import { User } from '@domain/entities'
import { AuthorityEventBusPort, GoogleOAuthPort, UserPort } from '@domain/ports'
import { AuthorityProvider, Email } from '@domain/value-objects'
import {
  AuthorityFailureReason,
  AuthorityLogEvent,
  logAxiomEvent,
  LogLevel
} from '@infra/axiom/observability'
import {
  AuthorityTokenService,
  type SessionContext
} from '@application/services/authority-token.service'

interface GoogleSignupResult {
  accessToken: string
  refreshToken: string
}

@Injectable()
export class GoogleSignupUseCase extends UseCase<
  [idToken: string, context: SessionContext],
  GoogleSignupResult
> {
  constructor(
    private readonly users: UserPort,
    private readonly tokens: AuthorityTokenService,
    private readonly google: GoogleOAuthPort,
    @Inject(AuthorityEventBusPort)
    private readonly events: AuthorityEventBusPort
  ) {
    super()
  }

  async execute(
    idToken: string,
    context: SessionContext
  ): Promise<GoogleSignupResult> {
    const profile = await this.google.verifyIdToken(idToken)

    if (!profile.emailVerified) {
      void logAxiomEvent({
        event: AuthorityLogEvent.AuthGoogleSignupFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthorityFailureReason.EmailNotVerified,
          email: profile.email
        }
      })
      throw new ConflictException('Google account email not verified')
    }

    const existing = await this.users.findByEmail(Email.create(profile.email))

    if (existing) {
      void logAxiomEvent({
        event: AuthorityLogEvent.AuthGoogleSignupFailed,
        level: LogLevel.Warn,
        context: {
          reason: AuthorityFailureReason.EmailAlreadyRegistered,
          userId: existing.idString
        }
      })
      throw new ConflictException('Email already registered')
    }

    const user = User.create({
      email: profile.email,
      passwordHash: null,
      provider: AuthorityProvider.Google,
      providerUserId: profile.providerUserId,
      name: profile.name ?? null,
      createdAt: new Date()
    })

    await this.users.create(user)

    const { accessToken, refreshToken, sessionId } =
      await this.tokens.createSession(user, context)

    void this.events
      .emit('authority.user.signed_up', {
        userId: user.idString,
        email: user.email,
        provider: user.provider,
        name: user.name,
        occurredAt: new Date().toISOString()
      })
      .catch((error) => {
        void logAxiomEvent({
          event: AuthorityLogEvent.AuthorityEventPublishFailed,
          level: LogLevel.Warn,
          context: {
            event: 'authority.user.signed_up',
            errorName: error instanceof Error ? error.name : 'unknown'
          }
        })
      })

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
