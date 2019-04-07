import { Credentials } from '../../src/model/Credentials';
import { JwtCrypter } from '../../src/security/JwtCrypter';

interface TestObject {
    credentials: Credentials;

    city: string;

    age: number;
}


describe('The JwtCrypter', () => {

    let jwtCrypter: JwtCrypter<Credentials>;

    let credentials: Credentials;

    let testObject: TestObject;

    beforeEach(() => {
        jwtCrypter = new JwtCrypter<Credentials>();

        credentials = {
            username: 'ChickenLegs',
            password: 'test123abc'
        };

        testObject = {
            credentials: credentials,
            city: 'Tromsø',
            age: 29
        };
    });

    it('should encrypt the object token', async () => {
        const jwt: string = await jwtCrypter.encryptToken(credentials);
        expect(jwt).not.toEqual(credentials as any);
        expect(typeof jwt).toEqual('string');
    });

    it('should decrypt the credentials token', async () => {
        const jwt: string = await jwtCrypter.encryptToken(credentials);
        const decryptedCredentials: Credentials = jwtCrypter.decryptToken(jwt);
        expect(decryptedCredentials).toEqual(credentials);
        expect(decryptedCredentials.password).toEqual(credentials.password);
        expect(decryptedCredentials.username).toEqual(credentials.username);
    });

    it('should decrypt the testObject token', async () => {
        const jwtCrypter = new JwtCrypter<TestObject>();
        const jwt: string = await jwtCrypter.encryptToken(testObject);
        const decryptedTestObject: TestObject = jwtCrypter.decryptToken(jwt);
        expect(decryptedTestObject).toEqual(testObject);
        expect(decryptedTestObject.age).toEqual(testObject.age);
        expect(decryptedTestObject.city).toEqual(testObject.city);
        expect(decryptedTestObject.credentials).toEqual(testObject.credentials);
        expect(decryptedTestObject.credentials.username).toEqual(testObject.credentials.username);
        expect(decryptedTestObject.credentials.password).toEqual(testObject.credentials.password);
    });

});
