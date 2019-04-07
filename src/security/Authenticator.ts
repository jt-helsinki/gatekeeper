import { UserDynamoDB } from '../datastore/UserDynamoDB';
import { Cache } from '../model/Cache';
import { Credentials } from '../model/Credentials';
import { Database } from '../model/Database';
import { Session } from '../model/Session';
import { User } from '../model/User';
import { JwtCrypter } from './JwtCrypter';
import { v4 } from 'uuid';
import { PasswordCrypter } from './PasswordCrypter';


export class Authenticator {

    private cache: Cache;

    private database: Database

    private jwtToken: JwtCrypter<Session> = new JwtCrypter();

    public constructor(cache: Cache, database: Database) {
        this.cache = cache;
        this.database = database;
    }


    /**
     *
     * @param {Credentials} credentials
     * @return {string} an encrypted JSON Web Token or null.
     */
    public async login(credentials: Credentials): Promise<string | undefined> {
        if (!credentials.username || credentials.username.length < 3 || !credentials.password || credentials.password.length < 3) {
            return undefined;
        }
        const user: User = await this.database.findByKey<User>(credentials.username);
        if (!user || !await PasswordCrypter.doesStringMatchHash(credentials.password, user.password)) {
            return undefined;
        }
        const uuid: string = v4();
        const session: Session = {
            sessionKey: uuid,
            username: credentials.username,
            isSessionValid: true
        };
        this.cache.save(uuid, session);
        return this.jwtToken.encryptToken(session);

    }

    logout(encryptedJwt: string): Promise<string> {
        const session: Session = this.jwtToken.decryptToken(encryptedJwt);
        if (session.isSessionValid === true) {
            this.cache.remove(session.sessionKey);
        }
        session.sessionKey = '';
        session.username = '';
        session.isSessionValid = false;
        return this.jwtToken.encryptToken(session);
    }

}
