import { UserDynamoDB } from '../../src/datastore/UserDynamoDB';
import { Database } from '../../src/model/Database';
import { User } from '../../src/model/User';
import { TestUtils } from '../TestUtils';


describe('The UserDynamoDB', () => {

    const TABLE_NAME: string = UserDynamoDB.TABLE_NAME;

    const KEY_NAME: string = UserDynamoDB.KEY_NAME;

    let database: Database;

    const connectionOptions = UserDynamoDB.connectionFactory('test');

    const user: User = {
        firstName: 'Shazza',
        lastName: 'Smith',
        email: 'shazza@test.com',
        username: 'ChickenLegs',
        password: 'test123'
    }

    beforeEach(async () => {
        database = new UserDynamoDB(connectionOptions);
        await TestUtils.createDynamoDBTable(TABLE_NAME, KEY_NAME, database.getConnection())
        await TestUtils.putOrUpdateUser(TABLE_NAME, KEY_NAME, database.getConnection(), user);
    });

    afterEach(async () => {
        database = new UserDynamoDB(connectionOptions);
        await TestUtils.dropDynamoDBTable(TABLE_NAME, database.getConnection());

    });

    it('should find a record from DynamoDB', async () => {
        const userFromDB: User = await database.findByKey('ChickenLegs');
        expect(userFromDB).not.toBeUndefined();
        expect(userFromDB.firstName).toEqual(user.firstName);
        expect(userFromDB.lastName).toEqual(user.lastName);
        expect(userFromDB.email).toEqual(user.email);
        expect(userFromDB.username).toEqual(user.username);
        expect(userFromDB.password).toEqual(user.password);
    });

    it('should not find an invalid record from DynamoDB', async () => {
        const userFromDB: User = await database.findByKey<User>('Showbags');
        expect(userFromDB).toBeUndefined();
    });

});


