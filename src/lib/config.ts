const config = {
    env: {
        databaseURL: process.env.AUTH_DRIZZLE_URL!,
        mapBoxToken: process.env.NEXT_PUBLIC_MAP_BOX_TOKEN!,
        upstash: {
            redisUrl: process.env.UPSTASH_REDIS_URL!,
            redisToken: process.env.UPSTASH_REDIS_TOKEN!,
        },
    },
};

export default config;