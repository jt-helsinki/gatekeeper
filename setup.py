#!/usr/bin/env python3
import bcrypt
import fileinput
import os
from subprocess import call


FILE_PATH = os.path.join(os.path.dirname(__file__), 'serverless.yml')

def ask_user_for_region():

    regions = ["eu-west-1 (Ireland)", "eu-west-2 (London)", "eu-west-3 (Paris)", "eu-central-1 (Frankfurt)", "Quit "]

    for idx, region in enumerate(regions):
        print("[" + str(idx+1) + "]", region)
    region_string = regions[0]
    while True:
        region_input = input('Enter the number of your region above.')
        if (is_int(region_input)):
            region_input_int = int(region_input)
            if (region_input_int > 0 and region_input_int <= (len(regions) - 1)):
                return regions[region_input_int - 1].split(" ")[0]
            elif (region_input_int <= len(regions)):
                print("Exiting setup.")
                exit()

def ask_or_default(question, default_value):
    return input(question) or default_value


def run_commands():
    call(["npm", "install", "-g", "serverless"])
    call(["npm", "install"])
    call(["docker", "pull", "amazon/dynamodb-local"])
    call(["docker", "pull", "redis"])
    call(["cp", "serverless.yml.dist", "serverless.yml"])


def replace_text(region, secret_key, redis_url, redis_port):
    with fileinput.FileInput(FILE_PATH, inplace=True) as file:
        for line in file:
            print(line.replace("SECRET_KEY_PLACEHOLDER", secret_key)
                  .replace("REGION_PLACEHOLDER", region)
                  .replace("REDIS_PORT_PLACEHOLDER", redis_port)
                  .replace("REDIS_URL_PLACEHOLDER", redis_url), end='')


def is_int(input):
    try:
        int(input)
        return True
    except ValueError:
        return False


if __name__ == '__main__':
    print('''                                                                                                                            
 ██████╗  █████╗ ████████╗███████╗██╗  ██╗███████╗███████╗██████╗ ███████╗██████╗ 
██╔════╝ ██╔══██╗╚══██╔══╝██╔════╝██║ ██╔╝██╔════╝██╔════╝██╔══██╗██╔════╝██╔══██╗
██║  ███╗███████║   ██║   █████╗  █████╔╝ █████╗  █████╗  ██████╔╝█████╗  ██████╔╝
██║   ██║██╔══██║   ██║   ██╔══╝  ██╔═██╗ ██╔══╝  ██╔══╝  ██╔═══╝ ██╔══╝  ██╔══██╗
╚██████╔╝██║  ██║   ██║   ███████╗██║  ██╗███████╗███████╗██║     ███████╗██║  ██║
 ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝                                                                          
    ''')

    region = ask_user_for_region()
    secret_key = bcrypt.gensalt().decode("utf-8")
    redis_url = ask_or_default('Enter the local Redis url or hit Enter for default (redis://127.0.0.1)', 'redis://127.0.0.1')
    redis_port = ask_or_default('Enter the local Redis port or hit Enter for default (6379)', '6379')

    print("Region: " + region)
    print("Secret Key: " + secret_key)

    run_commands()
    replace_text(region, secret_key, redis_url, redis_port)

    print('''
**************************
Local setup complete.

AWS Region: %(region)s
Secret Key: %(secret_key)s
Redis URL: %(redis_url)s
Redis Port: %(redis_port)s

To run DynamoDB locally run:

  docker run -p 8000:8000 amazon/dynamodb-local

**************************
    ''' %
        {
            'region': region,
            'secret_key': secret_key,
            'redis_url': redis_url,
            'redis_port': redis_port
        })

    exit()

