export interface Database {

    /**
     * Get the underlying database connection.
     *
     * @return {any}
     */
    getConnection(): any;

    /**
     * Finds a record by its id.
     *
     * @param {string} keyValue The unique key value to search by.
     * @return {Promise<T>}
     */
    findByKey<T>(keyValue: string): Promise<T>;

}
