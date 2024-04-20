const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'SocialSync API',
            version: '0.1.0',
            description: 'This doc describes the SocialSync API',
        },
        servers: [
            {
                url: 'http://localhost:3000/',
            },
        ],
    },
    apis: ['src/swagger/*.swagger.yml'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
