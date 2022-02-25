export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  createdAt: Date | string;
  isMember: boolean;
  verified: boolean;
  acceptedRules: boolean;
  solvedCaptcha: boolean;
}
