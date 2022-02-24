export interface NearUser {
  walletId: string;
  points: number;
  level: number;
  staked: boolean;
  creditToNextLevel: number;
  requiredToNextLevel: number;
  createdAt: Date;
}
