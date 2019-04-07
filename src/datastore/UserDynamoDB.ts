import { AWSError, DynamoDB } from 'aws-sdk';
import { isNullOrUndefined } from 'util';
const attr = require('dynamodb-data-types').AttributeValue;

import { Database } from '../model/Database';

export interface ConnectionOptions {

    endpoint: string;

    region: string;
}


export class UserDynamoDB implements Database {

    public static readonly TABLE_NAME: string = 'USERS';

    public static readonly KEY_NAME: string = 'ID';

    private dynamoDb: DynamoDB;

    constructor(connectionOptions? : ConnectionOptions | undefined) {
        this.dynamoDb = new DynamoDB(connectionOptions);
    }

    public getConnection(): DynamoDB {
        return this.dynamoDb;
    }

    public findByKey<T>(keyValue: string): Promise<T> {
        const key = {};
        key[UserDynamoDB.KEY_NAME] = keyValue ;
        const params: DynamoDB.Types.GetItemInput = {
            TableName: UserDynamoDB.TABLE_NAME,
            Key: attr.wrap(key)
        };
        return new Promise<T>((ok: any, fail: any) => {
            if (!keyValue) return ok(undefined);
            this.dynamoDb.getItem(params, (err: AWSError, data: DynamoDB.Types.GetItemOutput): void => {
                console.log("as****", data, params);
                if (err) return fail(err);
                if (Object.entries(data).length === 0) return ok(undefined);
                ok(attr.unwrap(data.Item));
            });
        });
    }

    public static connectionFactory(environment: 'dev' | 'test' | 'production'): ConnectionOptions | undefined {
        switch (environment) {
            case 'dev' :
                return {
                    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
                    region: 'localhost',
                }
            case 'test' :
                return {
                    endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:7999',
                    region: 'localhost',
                }
            default :
                return undefined;
        }
    }
}
