import { PasswordCrypter } from '../../src/security/PasswordCrypter';

describe('The PasswordCrypter', () => {

    it('should generate salt', async () => {
        const salt: string =  await PasswordCrypter.salt();
        const salt2: string =  await PasswordCrypter.salt();
        expect(salt).not.toEqual(salt2);
        expect(salt.length).toEqual(salt2.length);
        expect(salt.length).toBeGreaterThan(28);
    });

    it('should encrypt the string with same salt', async () => {
        const clearString: string = 'ShazzaAndMazza';
        const salt: string =  await PasswordCrypter.salt();
        const hashedString: string = await PasswordCrypter.hashString(clearString, salt);
        const hashedStringAgain: string = await PasswordCrypter.hashString(clearString, salt);
        expect(hashedString).not.toEqual(clearString);
        expect(hashedString).toEqual(hashedStringAgain);
    });

    it('should not encrypt the string with different salt', async () => {
        const clearString: string = 'ShazzaAndMazza';
        const salt: string =  await PasswordCrypter.salt();
        const salt2: string =  await PasswordCrypter.salt();
        const hashedString: string = await PasswordCrypter.hashString(clearString, salt);
        const hashedStringAgain: string = await PasswordCrypter.hashString(clearString, salt2);
        expect(hashedString).not.toEqual(clearString);
        expect(hashedString).not.toEqual(hashedStringAgain);
    });

    it('should validate a password against a hash as true', async () => {
        const clearString: string = 'ShazzaAndMazza';
        const salt: string =  await PasswordCrypter.salt();
        const hashedString: string = await PasswordCrypter.hashString(clearString, salt);
        const match: boolean = await PasswordCrypter.doesStringMatchHash(clearString, hashedString);
        expect(hashedString).not.toEqual(clearString);
        expect(match).toEqual(true);
    });

    it('should validate an invalid password against a hash', async () => {
        const clearString: string = 'ShazzaAndMazza';
        const invalidClearString: string = 'ShazzaAndMazzaAndBazza';
        const salt: string =  await PasswordCrypter.salt();
        const hashedString: string = await PasswordCrypter.hashString(clearString, salt);
        const match: boolean = await PasswordCrypter.doesStringMatchHash(invalidClearString, hashedString);
        expect(hashedString).not.toEqual(clearString);
        expect(hashedString).not.toEqual(invalidClearString);
        expect(clearString).not.toEqual(invalidClearString);
        expect(match).toEqual(false);
    });


});
