import * as jwt from "jsonwebtoken";
import { strict as assert } from 'assert';


/**
 * Encrypts and decrypts objects into a value that can be used in a JSON Web Token. Put the encrypted token
 * in the header of each response. For example:
 *
 *      Bearer <ENCRYPTED_JWT_STRING>
 *
 * Every endpoint you wish to check should validate against this token.
 *
 * Note: tokens must be objects. Raw strings and numbers are not accepted.
 */
export class JwtCrypter<T extends object> {

    private secret: string = process.env.SECRET_KEY as string;

    public constructor() {
        // NOOP
    }

    /**
     * Creates a token from the object.
     *
     * @param {T} token The contents of the object to encrypt inside the token.
     * @return {Promise<string>}
     */
    public encryptToken(token: T): Promise<string> {
        assert(this.secret != null, 'Error: environment variable SECRET_KEY is not set.');
        return new Promise<string>((ok, fail) => {
            jwt.sign(JSON.stringify(token), this.secret, { algorithm: "HS256" }, (err: any, encryptedToken: string) => err ? fail(err) : ok(encryptedToken));
        });
    }

    /**
     * Decrypts the contents of the token into an object.
     *
     * @param {string} token The encrypted token containing the object.
     * @return {T} The decrypted contents of the token as an object of type T.
     */
    public decryptToken(token: string): T {
        assert(this.secret != null, 'Error: environment variable SECRET_KEY is not set.');
        return jwt.verify(token, this.secret) as T;
    }

}
