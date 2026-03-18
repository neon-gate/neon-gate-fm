/**
 * NATS subjects emitted by the Slim Shady microservice.
 * These cover the user profile lifecycle.
 */
export enum UserEvent {
  /** Emitted after a profile is created. */
  ProfileCreated = 'user.profile.created',
  /** Emitted after a profile is updated. */
  ProfileUpdated = 'user.profile.updated',
  /** Emitted after a profile is deleted. */
  ProfileDeleted = 'user.profile.deleted'
}
