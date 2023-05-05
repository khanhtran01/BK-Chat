const app = require('../src/index.js');
const request = require('supertest');

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
});

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
});

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
});
