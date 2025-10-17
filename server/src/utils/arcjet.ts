import arcjet, {
  detectBot,
  fixedWindow,
  protectSignup,
  shield,
  tokenBucket,
} from "@arcjet/node";

export const aj = arcjet({
  key: process.env.ARCJET_KEY as string,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
        "STRIPE_WEBHOOK",
      ],
    }),
    shield({
      mode: "DRY_RUN",
    }),
    protectSignup({
      email: {
        mode: "LIVE",
        block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
      },
      bots: {
        mode: "LIVE",

        allow: [],
      },

      rateLimit: {
        mode: "LIVE",
        interval: "10m",
        max: 5,
      },
    }),
    fixedWindow({
      characteristics: ["userId"],
      mode: "LIVE",
      window: "1m",
      max: 5,
    }),
  ],
});
