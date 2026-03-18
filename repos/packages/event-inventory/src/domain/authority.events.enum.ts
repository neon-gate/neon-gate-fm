/**
 * NATS subjects emitted by the Authority microservice.
 * These cover the full authentication lifecycle.
 */
export enum AuthorityEvent {
  /** Emitted when a new user completes signup. */
  UserSignedUp = 'authority.user.signed_up',
  /** Emitted when an existing user logs in. */
  UserLoggedIn = 'authority.user.logged_in',
  /** Emitted when an access token is refreshed. */
  TokenRefreshed = 'authority.token.refreshed',
  /** Emitted when a user logs out. */
  UserLoggedOut = 'authority.user.logged_out'
}
