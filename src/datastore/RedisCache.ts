import { RedisClient, createClient } from 'redis';
import { Cache } from '../model/Cache';


/**
 * Saves, gets and deletes from the Redis Cache.
 */
export class RedisCache implements Cache {

    private redisClient: RedisClient;

    private sessionTimeoutSeconds: number;

    constructor(url: string = 'redis://127.0.0.1', port: number = 6379, sessionTimeoutSeconds: number = 7200) {
        this.sessionTimeoutSeconds = sessionTimeoutSeconds;
        this.redisClient = createClient({
            url: url,
            port: port
        })
    }


    public save(key: string, value: any, expiresInHowManySeconds: number = 40320): Promise<void> {
        return new Promise<void>((ok, fail) => {
            this.redisClient.set(key, JSON.stringify(value), (err: any) => err ? fail(err) : ok());
            this.redisClient.expire(key, expiresInHowManySeconds);
        });
    }


    public get<T>(key: string): Promise<T> {
        return new Promise<T>((ok: any, fail: any) => {
            if (!key)
                return ok(undefined);

            this.redisClient.get(key, (err: any, response: any) => {
                if (err)
                    return fail(err);

                if (!response)
                    return ok(undefined);
                ok(JSON.parse(response));
            });
        });
    }


    public remove(key: string): Promise<void> {
        return new Promise<void>((ok, fail) => {
            this.redisClient.del(key, (err: any) => err ? fail(err) : ok());
        });
    }






}
