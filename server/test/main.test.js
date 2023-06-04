const app = require('../src/index.js');
const request = require('supertest');
// 5
describe('POST /api/auth/login. Test Authentication', () => {
    it('should return a 200 OK status and a JWT token', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(true);
        expect(res.body.token).toBeDefined();
    });

    it('should return a 200 OK status and a JWT token', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'anhcuoirere@gmail.com',
            password: 'bao7122001',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(true);
        expect(res.body.token).toBeDefined();
    });

    it('should return a message "Your email is not verified"', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'test@example.com',
            password: 'invalidpassword',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(false);
        expect(res.body.message).toEqual('Your email is not verified');
    });

    it('should return a message "Invalid email or password"', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'test@gmail.com',
            password: 'invalidpassword',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(false);
        expect(res.body.message).toEqual('Invalid email or password');
    });

    it('should return a message "Invalid email or password"', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'user2@gmail.com',
            password: 'invalidpassword',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(false);
        expect(res.body.message).toEqual('Invalid email or password');
    });
});
// 5
describe('GET /api/home', () => {
    it('should return a 200 OK status', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/home')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
    });

    it('should return a 200 OK status', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'anhcuoirere@gmail.com',
            password: 'bao7122001',
        });
        const res = await request(app)
            .get('/api/home')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
    });

    it('should return a 401 Unauthorized status', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'test@gmail.com',
            password: 'invalidpassword',
        });
        const res = await request(app)
            .get('/api/home')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(401);
    });

    it('should return a 401 Unauthorized status', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'test@gmail.com',
            password: 'invalidpassword',
        });
        const res = await request(app)
            .get('/api/home')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(401);
    });

    it('should return a 401 Unauthorized status', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'test1@gmail.com',
            password: 'invalidpassword',
        });
        const res = await request(app)
            .get('/api/home')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(401);
    });
});
// 3
describe('GET /api/user/get-infor', () => {
    it('should return a 200 OK status and a user information', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/user/get-infor')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.userInfor).toBeDefined();
    });

    it('should return a 200 OK status and a user information', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'anhcuoirere@gmail.com',
            password: 'bao7122001',
        });
        const res = await request(app)
            .get('/api/user/get-infor')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.userInfor).toBeDefined();
    });

    it('should return a 200 OK status and a user information', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'user2@gmail.com',
            password: 'bao7122001',
        });
        const res = await request(app)
            .get('/api/user/get-infor')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.userInfor).toBeDefined();
    });
});
// 2
describe('PUT /api/user/update-personal-info', () => {
    it('should return a 200 OK status', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .put('/api/user/update-personal-info')
            .set('Authorization', 'Bearer ' + loginResponse.body.token)
            .send({
                username: 'admin1',
                desc: 'update test user information',
                address: 'VN',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(true);
    });

    it('should return a 200 OK status', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'anhcuoirere@gmail.com',
            password: 'bao7122001',
        });
        const res = await request(app)
            .put('/api/user/update-personal-info')
            .set('Authorization', 'Bearer ' + loginResponse.body.token)
            .send({
                username: 'anhcuoirere',
                desc: 'update test user information',
                address: 'VN',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(true);
    });
});
// 5
describe('GET /api/user/search-contact', () => {
    it('should return a 200 OK status and be contacted', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/user/search-contact')
            .set('Authorization', 'Bearer ' + loginResponse.body.token)
            .query({
                email: 'user2@gmail.com',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.isContacted).toEqual(1);
    });

    it('should return a 200 OK status and be contacted', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/user/search-contact')
            .set('Authorization', 'Bearer ' + loginResponse.body.token)
            .query({
                email: 'anhcuoirere@gmail.com',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.isContacted).toEqual(1);
    });

    it('should return a 200 OK status and not be contacted', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/user/search-contact')
            .set('Authorization', 'Bearer ' + loginResponse.body.token)
            .query({
                email: 'test@example.com',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.isContacted).toEqual(0);
    });

    it('should return a 200 OK status and not be contacted', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/user/search-contact')
            .set('Authorization', 'Bearer ' + loginResponse.body.token)
            .query({
                email: 'test@example.com',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.isContacted).toEqual(0);
    });

    it('should return a 200 OK status and not be contacted', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/user/search-contact')
            .set('Authorization', 'Bearer ' + loginResponse.body.token)
            .query({
                email: 'test2@example.com',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.isContacted).toEqual(0);
    });
});
// 5
describe('GET /api/notification/get', () => {
    it('should return a 200 OK status and suggestions', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin1@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/notification/get')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.notifications).toBeDefined();
    });

    it('should return a 200 OK status and suggestions', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin2@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/notification/get')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.notifications).toBeDefined();
    });

    it('should return a 200 OK status and suggestions', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin3@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/notification/get')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.notifications).toBeDefined();
    });

    it('should return a 200 OK status and suggestions', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin4@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/notification/get')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.notifications).toBeDefined();
    });

    it('should return a 200 OK status and suggestions', async () => {
        const loginResponse = await request(app).post('/api/auth/login').send({
            email: 'admin5@gmail.com',
            password: 'admin12345',
        });
        const res = await request(app)
            .get('/api/notification/get')
            .set('Authorization', 'Bearer ' + loginResponse.body.token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.notifications).toBeDefined();
    });
});
// 5
describe('GET /api/auth/verify-email', () => {
    it('should return a 200 OK status and message "Email is not exist"', async () => {
        const res = await request(app).get('/api/auth/verify-email').query({
            email: 'test@example.com',
            token: '106228567',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(false);
        expect(res.body.message).toEqual('Email is not exist');
    });

    it('should return a 200 OK status and message "Email is not exist"', async () => {
        const res = await request(app).get('/api/auth/verify-email').query({
            email: 'test1@example.com',
            token: '106228567',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(false);
        expect(res.body.message).toEqual('Email is not exist');
    });

    it('should return a 200 OK status and message "Email is already verified, or token is not valid"', async () => {
        const res = await request(app).get('/api/auth/verify-email').query({
            email: 'test@example.com',
            token: '106228567',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(false);
        expect(res.body.message).toEqual('Email is already verified, or token is not valid');
    });

    it('should return a 200 OK status and message "Email is already verified, or token is not valid"', async () => {
        const res = await request(app).get('/api/auth/verify-email').query({
            email: 'user2@gmail.com',
            token: '426810263',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(true);
        expect(res.body.message).toEqual('Email is already verified, or token is not valid');
    });

    it('should return a 200 OK status and message "Verify Successfully"', async () => {
        const res = await request(app).get('/api/auth/verify-email').query({
            email: 'user3@gmail.com',
            token: '426810263',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.successful).toEqual(true);
        expect(res.body.message).toEqual('Verify Successfully');
    });
});
