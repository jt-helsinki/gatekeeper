import { UserDynamoDB } from '../../src/datastore/UserDynamoDB';
import { Database } from '../../src/model/Database';
import { User } from '../../src/model/User';
import { PasswordCrypter } from '../../src/security/PasswordCrypter';
import { TestUtils } from '../TestUtils';


describe('The CreateDevUser', () => {

    const TABLE_NAME: string = UserDynamoDB.TABLE_NAME;

    const KEY_NAME: string = UserDynamoDB.KEY_NAME;

    it('should create a user for development purposes.', async () => {

        const database: Database = new UserDynamoDB(UserDynamoDB.connectionFactory('dev'));
        try {
            await TestUtils.dropDynamoDBTable(TABLE_NAME, database.getConnection());
        } catch (ex) {
            console.log(`Table: ${TABLE_NAME} does not exists. Creating table.`)
        }
        const user: User = {
            firstName: 'Shazza',
            lastName: 'Smith',
            email: 'shazza@test.com',
            username: 'ChickenLegs',
            password: await PasswordCrypter.hashString('test123')
        }
        await TestUtils.createDynamoDBTable(TABLE_NAME, KEY_NAME, database.getConnection());
        await TestUtils.putOrUpdateUser(TABLE_NAME, KEY_NAME, database.getConnection(), user);
        const userFromDB: User = await database.findByKey<User>('ChickenLegs');
        expect(userFromDB).not.toBeUndefined();

    });

});


