/* eslint-disable @typescript-eslint/no-non-null-assertion */
const config = {
  baseApiUrl: process.env.BASE_API_URL!,
  redirectUri: process.env.REDIRECT_URI!,
  tweetId: process.env.TWEET_ID!,
  dateThreshold: new Date(process.env.DATE_THRESHOLD!),
};

function assertConfig(c: typeof config) {
  for (const [key, val] of Object.entries(c)) {
    if (val == null) throw new Error(`Environment variable not set: ${key}`);
  }
}
assertConfig(config);

export default config;
