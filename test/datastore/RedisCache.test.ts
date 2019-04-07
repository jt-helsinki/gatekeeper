import { v4 } from 'uuid';
import { RedisCache } from '../../src/datastore/RedisCache';
import { Cache } from '../../src/model/Cache';
import { Credentials } from '../../src/model/Credentials';

interface TestObject {
    credentials: Credentials;

    city: string;

    age: number;
}


describe('The RedisCache', () => {

    let redisCache: Cache;

    let credentials: Credentials;

    let testObject: TestObject;

    let uuid: string;

    beforeEach(() => {
        // Testing only.
        // 6378 is the port specified when running the docker container in test.
        // Normally, in production and development the port is 6379.
        redisCache = new RedisCache('redis://127.0.0.1', 6378);
        uuid = v4();

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

    it('should put something into the cache', async () => {
        redisCache.save(uuid, testObject);
    });

    it('should retreive something from the cache', async () => {
        redisCache.save(uuid, testObject);
        const testobjectFromCache: TestObject = await redisCache.get<TestObject>(uuid);
        expect(testobjectFromCache).toEqual(testObject);
        expect(testobjectFromCache.age).toEqual(testObject.age);
        expect(testobjectFromCache.city).toEqual(testObject.city);
        expect(testobjectFromCache.credentials).toEqual(testObject.credentials);
        expect(testobjectFromCache.credentials.username).toEqual(testObject.credentials.username);
        expect(testobjectFromCache.credentials.password).toEqual(testObject.credentials.password);
    });

    it('should retreive something from the cache', async () => {
        redisCache.save(uuid, testObject);
        const testobjectFromCache: TestObject = await redisCache.get<TestObject>(uuid);
        expect(testobjectFromCache).toEqual(testObject);
        expect(testobjectFromCache.age).toEqual(testObject.age);
        expect(testobjectFromCache.city).toEqual(testObject.city);
        expect(testobjectFromCache.credentials).toEqual(testObject.credentials);
        expect(testobjectFromCache.credentials.username).toEqual(testObject.credentials.username);
        expect(testobjectFromCache.credentials.password).toEqual(testObject.credentials.password);
    });

    it('should fail gracefully on get() with invalid key', async () => {
        const testobjectFromCache: TestObject = await redisCache.get<TestObject>('fake-key');
        expect(testobjectFromCache).toBeUndefined();
    });

    it('should delete from the cache', async () => {
        redisCache.save(uuid, testObject);
        let testobjectFromCache: TestObject = await redisCache.get<TestObject>(uuid);
        expect(testobjectFromCache).not.toBeNull();
        expect(testobjectFromCache).not.toBeUndefined();

        redisCache.remove(uuid);
        testobjectFromCache = await redisCache.get<TestObject>(uuid);
        expect(testobjectFromCache).toBeUndefined();
    });

    it('should retreive gracefully fail on get() with invalid key', async () => {
        await redisCache.remove('fake-key');
    });

});
