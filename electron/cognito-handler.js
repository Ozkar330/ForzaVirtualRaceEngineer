const { CognitoIdentityProviderClient, InitiateAuthCommand, GetUserCommand, GlobalSignOutCommand } = require('@aws-sdk/client-cognito-identity-provider');

// Configuración de Cognito (mismos valores que Python)
const USER_POOL_ID = "us-east-1_WRwcwjyj4";
const CLIENT_ID = "2nr4s8pcc36ppp5o212mpcmfmj";
const AWS_REGION = "us-east-1";

class CognitoHandler {
    constructor() {
        this.client = new CognitoIdentityProviderClient({ 
            region: AWS_REGION 
        });
        this.tokens = null;
        this.username = null;
    }

    async login(username, password) {
        try {
            const command = new InitiateAuthCommand({
                AuthFlow: "USER_PASSWORD_AUTH",
                AuthParameters: {
                    USERNAME: username,
                    PASSWORD: password
                },
                ClientId: CLIENT_ID
            });

            const response = await this.client.send(command);
            
            this.tokens = response.AuthenticationResult;
            this.username = username;
            
            // Calculate expiration time
            if (this.tokens.ExpiresIn) {
                this.tokens.expires_at = Math.floor(Date.now() / 1000) + this.tokens.ExpiresIn;
            }

            return {
                success: true,
                tokens: this.tokens
            };

        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message || 'Error de autenticación'
            };
        }
    }

    async getUserAttributes() {
        if (!this.tokens || !this.tokens.AccessToken) {
            throw new Error("No token disponible. Haz login primero.");
        }

        try {
            const command = new GetUserCommand({
                AccessToken: this.tokens.AccessToken
            });

            const response = await this.client.send(command);
            
            const attributes = {};
            response.UserAttributes.forEach(attr => {
                attributes[attr.Name] = attr.Value;
            });

            return attributes;

        } catch (error) {
            console.error('Get user attributes error:', error);
            throw error;
        }
    }

    async logout() {
        if (this.tokens && this.tokens.AccessToken) {
            try {
                const command = new GlobalSignOutCommand({
                    AccessToken: this.tokens.AccessToken
                });

                await this.client.send(command);
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
        
        this.tokens = null;
        this.username = null;
    }

    getAccessToken() {
        return this.tokens ? this.tokens.AccessToken : null;
    }

    isLoggedIn() {
        return this.tokens && this.tokens.AccessToken && 
               (!this.tokens.expires_at || Date.now() / 1000 < this.tokens.expires_at - 60);
    }

    //TODO: Agregar el refresh del token
}

module.exports = CognitoHandler;