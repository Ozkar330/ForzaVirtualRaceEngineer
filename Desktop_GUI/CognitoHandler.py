import os
import time

import boto3
from botocore.exceptions import ClientError

# Configura tus datos de Cognito
USER_POOL_ID = "us-east-1_WRwcwjyj4"
CLIENT_ID = "2nr4s8pcc36ppp5o212mpcmfmj"

os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'

class CognitoHandler:
    def __init__(self, username: str, password: str):
        self.client = boto3.client('cognito-idp')

        self.username = username
        self.password = password

        self.tokens = None

    def login(self):
        try:
            response = self.client.initiate_auth(
                AuthFlow="USER_PASSWORD_AUTH",
                AuthParameters={
                    "USERNAME": self.username,
                    "PASSWORD": self.password
                },
                ClientId=CLIENT_ID
            )

            self.tokens = response['AuthenticationResult']
            return self.tokens

        except ClientError as e:
            raise Exception(e.response['Error']['Message'])

    def logout(self):
        if self.tokens and self.tokens.get('AccessToken', None):
            self.client.global_sign_out(
                AccessToken=self.tokens['AccessToken'],
            )

    def refresh_token(self):
        client = boto3.client("cognito-idp")
        response = client.initiate_auth(
            AuthFlow="REFRESH_TOKEN_AUTH",
            AuthParameters={
                "REFRESH_TOKEN": self.tokens['RefreshToken']
            },
            ClientId=CLIENT_ID
        )

        self.tokens = response['AuthenticationResult']

    def get_access_token(self) -> str | None:
        if self.tokens and self.tokens.get('AccessToken', None):
            return self.tokens['AccessToken']
        return None

    def get_valid_access_token(self):
        if not self.tokens:
            raise Exception("⚠️ No hay sesión activa")

        if time.time() > self.tokens["expires_at"] - 60:  # Renovar si faltan <60s
            print("🔁 Token expirado o por expirar. Renovating...")
            new_tokens = self.refresh_token(self.tokens["RefreshToken"])
            return new_tokens["AccessToken"]
        else:
            return self.tokens["AccessToken"]