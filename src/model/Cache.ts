export interface Cache {

    /**
     * Saves string in the cache. For now, we are only storing strings.
     *
     * @param {string} key The key associated with the value inside the cache.
     * @param {string} value The value associated with the key inside the cache.
     * @param {number} expiresInHowManySeconds Time to Live for the item in the cache.
     * @return {Promise<void>}
     */
    save(key: string, value: any, expiresInHowManySeconds?: number): Promise<void>;

    /**
     * Get session user with the given token.
     *
     * @param {string} key The key associated with the value inside the cache.
     * @return {Promise<T>} the value associated with the key wrapped in a promise.
     */
    get<T>(key: string): Promise<T>;

    /**
     * Removes session user from the storage by given token.
     *
     * @param {string} key The key associated with the value inside the cache.
     */
    remove(key: string): Promise<void>;

}
