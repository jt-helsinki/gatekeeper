import { AWSError, DynamoDB } from 'aws-sdk';
const attr = require('dynamodb-data-types').AttributeValue;

import { User } from '../src/model/User';


export class TestUtils {


    public static createDynamoDBTable(tableName: string, keyName: string, dynamoDb: DynamoDB): Promise<void> {
        const params: any = {
            AttributeDefinitions: [
                {
                    AttributeName: keyName,
                    AttributeType: 'S'
                }
            ],
            KeySchema: [
                {
                    AttributeName: keyName,
                    KeyType: 'HASH'
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            },
            TableName: tableName,
            StreamSpecification: {
                StreamEnabled: false
            }
        };
        return new Promise<void>((ok: any, fail: any) => {
            dynamoDb.createTable(params, (err: AWSError, data: DynamoDB.Types.CreateTableOutput): void => {
                if (err) return fail(err);
                ok();
            });
        });
    }


    public static dropDynamoDBTable(tableName: string, dynamoDb: DynamoDB): Promise<void> {
        const params: any = {
            TableName: tableName
        };
        return new Promise<void>((ok: any, fail: any) => {
            dynamoDb.deleteTable(params, (err: AWSError, data: DynamoDB.Types.DeleteTableOutput): void => {
                if (err) return fail(err);
                ok();
            });
        });
    }

    public static putOrUpdateUser(tableName: string, keyName: string, dynamoDb: DynamoDB, user: User): Promise<void> {
        const key = {};
        key[keyName] = user.username;
        const params = {
            ExpressionAttributeValues: {
                ':firstName': {
                    S: user.firstName
                },
                ':lastName': {
                    S: user.lastName
                },
                ':email': {
                    S: user.email
                },
                ':username': {
                    S: user.username
                },
                ':password': {
                    S: user.password
                }
            },
            Key: attr.wrap(key),
            ReturnValues: "ALL_NEW",
            TableName: tableName,
            UpdateExpression: "SET firstName = :firstName, lastName = :lastName, email = :email, username = :username, password = :password"
        };
        return new Promise<void>((ok: any, fail: any) => {
            dynamoDb.updateItem(params, (err: AWSError, data: DynamoDB.Types.UpdateItemOutput): void => {
                if (err) return fail(err);
                ok();
            });
        });
    }


}
