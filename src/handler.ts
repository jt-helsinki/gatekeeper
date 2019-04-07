import { APIGatewayEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
import * as querystring from 'querystring';
import { RedisCache } from './datastore/RedisCache';
import { ConnectionOptions, UserDynamoDB } from './datastore/UserDynamoDB';
import { Cache } from './model/Cache';
import { Database } from './model/Database';
import { Authenticator } from './security/Authenticator';


interface Response {
    statusCode: number;

    headers: any;
}


export const login: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    // Parse the post body
    const data = JSON.parse(event.body as string);
    // Access variables from body
    const username = data.username;
    const password = data.password;
    const cache: Cache = new RedisCache();
    const connectionOptions: ConnectionOptions | undefined = UserDynamoDB.connectionFactory(process.env.ENVIRONMENT as any);
    const database: Database = new UserDynamoDB(connectionOptions);
    const authenticator: Authenticator = new Authenticator(cache, database);
    const jwt: string | undefined = await authenticator.login({
        username: username as string,
        password: password as string
    });

    return {
        statusCode: 200,
        headers: {
            'Authorization': jwt ? `Bearer ${jwt}` : ''
        },
        body: '',
        isBase64Encoded: false
    };
};


export const logout: APIGatewayProxyHandler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    context.callbackWaitsForEmptyEventLoop = false;
    const cache: Cache = new RedisCache();
    const database: Database = new UserDynamoDB();
    const authenticator: Authenticator = new Authenticator(cache, database);
    // const jwt: string | undefined = await authenticator.logout();

    return { 
        statusCode: 200,
        headers: {
            'Authorization': 'Bearer'
        },
        body: '',
        isBase64Encoded: false
    };
};
