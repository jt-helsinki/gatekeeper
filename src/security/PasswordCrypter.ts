import { compare, genSalt, hash } from 'bcrypt';


export class PasswordCrypter {

    private static readonly SALT_ROUNDS = 10;

    private constructor() {
        // NOOP
    }

    /**
     * Generates a cryptographic salt.
     *
     * @return {Promise<string>} the cryptographic salt wrapped in a promise.
     */
    public static salt(): Promise<string> {
        return genSalt(PasswordCrypter.SALT_ROUNDS);
    }

    /**
     * Creates a one way hash of a string wrapped in a promise.
     *
     * @param {string} stringToHash The string to hash.
     * @param {string} salt An optional cryptographic salt. If not supplied this function
     *      will generate its own salt. Do not reuse salt value. A new salt value should be
     *      generated for each new hashed string. Ordinarily, this parameter is not required.
     *
     * @return {Promise<string>} The one way hash of the string wrapped in a promise.
     */
    public static async hashString(stringToHash: string, salt?: string): Promise<string> {
        if (!salt) salt = await this.salt();
        return hash(stringToHash, salt);
    }

    /**
     * Compares a plain text string to a hashed string.
     *
     * @param {string} stringToCompare The plain text string to compare.
     * @param {string} hashedString The hashed string to compare against.
     * @return {Promise<boolean>} true if there is a match, false otherwise.
     */
    public static doesStringMatchHash(stringToCompare: string, hashedString: string): Promise<boolean> {
        return compare(stringToCompare, hashedString);
    }


}
