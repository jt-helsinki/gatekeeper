import { RedisCache } from '../../src/datastore/RedisCache';
import { UserDynamoDB } from '../../src/datastore/UserDynamoDB';
import { Cache } from '../../src/model/Cache';
import { Credentials } from '../../src/model/Credentials';
import { Database } from '../../src/model/Database';
import { Session } from '../../src/model/Session';
import { User } from '../../src/model/User';
import { Authenticator } from '../../src/security/Authenticator';
import { JwtCrypter } from '../../src/security/JwtCrypter';
import { PasswordCrypter } from '../../src/security/PasswordCrypter';
import { TestUtils } from '../TestUtils';


describe('The Authenticator', () => {

    const TABLE_NAME: string = UserDynamoDB.TABLE_NAME;

    const KEY_NAME: string = UserDynamoDB.KEY_NAME;

    let database: Database;

    let redisCache: Cache;

    const connectionOptions = {
        endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:7999',
        region: 'localhost',
    };

    let user: User;

    let authenticator: Authenticator;

    beforeEach(async () => {
        // Testing only.
        // 6378 is the port specified when running the docker container in test.
        // Normally, in production and development the port is 6379.
        redisCache = new RedisCache('redis://127.0.0.1', 6378);
        user = {
            firstName: 'Shazza',
            lastName: 'Smith',
            email: 'shazza@test.com',
            username: 'ChickenLegs',
            password: await PasswordCrypter.hashString('test123')
        }
        database = new UserDynamoDB(connectionOptions);
        authenticator = new Authenticator(redisCache, database);
        await TestUtils.createDynamoDBTable(TABLE_NAME, KEY_NAME, database.getConnection())
        await TestUtils.putOrUpdateUser(TABLE_NAME, KEY_NAME, database.getConnection(), user);
    });

    afterEach(async () => {
        database = new UserDynamoDB(connectionOptions);
        await TestUtils.dropDynamoDBTable(TABLE_NAME, database.getConnection());

    });

    it('should authenticate the user and return a JWT', async () => {
        // const password: string = await PasswordCrypter.hashString('test123');
        const jwt: string | undefined = await authenticator.login({username: 'ChickenLegs', password: 'test123'});
        expect(jwt).not.toBeUndefined();
    });

    it('should authenticate the user, return a JWT and decrypt the JWT', async () => {
        // const password: string = await PasswordCrypter.hashString('test123');
        const jwt: string | undefined = await authenticator.login({username: 'ChickenLegs', password: 'test123'});
        expect(jwt).not.toBeUndefined();
        // try to decrypt the token.
        const jwtCrypter: JwtCrypter<Session> = new JwtCrypter();
        const jwtSession: Session = jwtCrypter.decryptToken(jwt as string);
        expect(jwtSession.sessionKey.length).toEqual(36);
        expect(jwtSession.username).toEqual('ChickenLegs');
    });

    it('should not authenticate the user - incorrect password', async () => {
        // const password: string = await PasswordCrypter.hashString('test123');
        const jwt: string | undefined = await authenticator.login({username: 'ChickenLegs', password: 'test1234'});
        expect(jwt).toBeUndefined();
    });

    it('should not authenticate the user - incorrect username', async () => {
        // const password: string = await PasswordCrypter.hashString('test123');
        const jwt: string | undefined = await authenticator.login({username: 'Mudflap', password: 'test123'});
        expect(jwt).toBeUndefined();
    });

    it('should not authenticate the user - incorrect username & password', async () => {
        // const password: string = await PasswordCrypter.hashString('test123');
        const jwt: string | undefined = await authenticator.login({username: 'Mudflap', password: 'test1234'});
        expect(jwt).toBeUndefined();
    });


    it('should not authenticate the user and return a JWT with incorrect credentials - empty password', async () => {
        // const password: string = await PasswordCrypter.hashString('test123');
        const jwt: string | undefined = await authenticator.login({username: 'ChickenLegs', password: ''});
        expect(jwt).toBeUndefined();
    });

    it('should not authenticate the user and return a JWT with incorrect credentials = empty username', async () => {
        // const password: string = await PasswordCrypter.hashString('test123');
        const jwt: string | undefined = await authenticator.login({username: '', password: 'test12'});
        expect(jwt).toBeUndefined();
    });

    it('should not authenticate the incorrect credentials - empty username & password', async () => {
        // const password: string = await PasswordCrypter.hashString('test123');
        const jwt: string | undefined = await authenticator.login({username: '', password: ''});
        expect(jwt).toBeUndefined();
    });

    it('should authenticate the user, return a JWT and logout the JWT', async () => {
        // const password: string = await PasswordCrypter.hashString('test123');
        let jwt: string | undefined = await authenticator.login({username: 'ChickenLegs', password: 'test123'});
        expect(jwt).not.toBeUndefined();
        // try to decrypt the token.
        const jwtCrypter: JwtCrypter<Session> = new JwtCrypter();
        let jwtSession: Session = jwtCrypter.decryptToken(jwt as string);
        expect(jwtSession.sessionKey.length).toEqual(36);
        expect(jwtSession.username).toEqual('ChickenLegs');
        expect(jwtSession.isSessionValid).toEqual(true);

        // test that the session exists
        let cachedSession: Session = await redisCache.get<Session>(jwtSession.sessionKey);
        expect(cachedSession).not.toBeUndefined();
        expect(cachedSession.sessionKey.length).toEqual(36);
        expect(cachedSession.username).toEqual('ChickenLegs');
        expect(jwtSession.isSessionValid).toEqual(true);

        // now kill the session
        jwt = await authenticator.logout(jwt as string);
        jwtSession = jwtCrypter.decryptToken(jwt as string);
        cachedSession = await redisCache.get<Session>(jwtSession.sessionKey);
        expect(cachedSession).toBeUndefined();
        expect(jwtSession.sessionKey).toEqual('');
        expect(jwtSession.username).toEqual('');
        expect(jwtSession.isSessionValid).toEqual(false);
    });

});
