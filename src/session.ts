export enum SessionHeader {
  Discord = "X-Discord-Session",
  Twitter = "X-Twitter-Session",
}

export enum SessionStorageKey {
  Discord = "DISCORD_SESSION",
  Twitter = "TWITTER_SESSION",
}

export interface Session {
  discord?: DiscordSession;
}

export interface DiscordSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface TwitterSession {
  oauthToken: string;
  oauthTokenSecret: string;
}

export function getDiscordSessionHeader(
  res: Response
): DiscordSession | undefined {
  const sessionHeader = res.headers.get(SessionHeader.Discord);
  if (!sessionHeader) {
    console.error(`Discord session header ${SessionHeader.Discord} not set`);
    return;
  }
  let session: DiscordSession;
  try {
    session = JSON.parse(decodeURIComponent(sessionHeader));
  } catch (err) {
    console.error(
      `Discord session header ${SessionHeader.Discord} invalid: ${sessionHeader}`
    );
    return;
  }
  return session;
}

export function getTwitterSessionHeader(
  res: Response
): TwitterSession | undefined {
  const sessionHeader = res.headers.get(SessionHeader.Twitter);
  if (!sessionHeader) {
    console.error(`Twitter session header ${SessionHeader.Twitter} not set`);
    return;
  }
  let session: TwitterSession;
  try {
    session = JSON.parse(decodeURIComponent(sessionHeader));
  } catch (err) {
    console.error(
      `Twitter session header ${SessionHeader.Twitter} invalid: ${sessionHeader}`
    );
    return;
  }
  return session;
}
