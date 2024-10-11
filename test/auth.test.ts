import fastify from 'fastify';
import request from 'supertest';
import { authRoutes } from '../src/routes/authRoutes';
import * as authService from '../src/services/authService'; 

jest.mock('../src/services/authService'); 

describe('Auth Routes', () => {
  let app: any;

  beforeAll(async () => {
    app = fastify(); 
    app.register(authRoutes); 
    await app.ready(); 
  });

  afterAll(async () => {
    await app.close(); 
  });

  describe('POST /api/v1/auth/register', () => {
    it('should return 201 and user data on successful registration', async () => {
      const mockUser = { id: '1', name: 'Test User', userName: 'testuser', role: 'user' };
      (authService.registerService as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app.server) 
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', role: 'user', userName: 'testuser', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 400 on registration error', async () => {
      (authService.registerService as jest.Mock).mockRejectedValue(new Error('Error during registration'));

      const response = await request(app.server)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', role: 'user', userName: 'testuser', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Error during registration' }); 
    });
  });

  describe('POST /api/v1/auth/login', ()=>{
    it('should return 200 and tokens on successful login', async () => {
      const mockUser = { user: { id: '1', userName: 'testuser' }, accessToken: 'mockAccessToken', refreshToken: 'mockRefreshToken' };
      (authService.loginService as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app.server)
        .post('/api/v1/auth/login')
        .send({ userName: 'testuser', password: 'password123', checkPassword: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 401 if passwords do not match', async () => {
      const response = await request(app.server)
        .post('/api/v1/auth/login')
        .send({ userName: 'testuser', password: 'password123', checkPassword: 'password456' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("As senhas são diferentes");
    });

    it('should return 401 if credentials are invalid', async () => {
      (authService.loginService as jest.Mock).mockRejectedValue(new Error('Credenciais inválidas'));

      const response = await request(app.server)
        .post('/api/v1/auth/login')
        .send({ userName: 'testuser', password: 'wrongpassword', checkPassword: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Credenciais inválidas');
    });
  })
  describe('POST /api/v1/auth/register', ()=>{
    it('should return 201 and user data on successful registration', async () => {
      const mockUser = { id: '1', name: 'Test User', userName: 'testuser', role: 'user' };
      (authService.registerService as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app.server)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', role: 'user', userName: 'testuser', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
    });

    it('should return 400 on registration error', async () => {
      (authService.registerService as jest.Mock).mockRejectedValue(new Error('Error during registration'));

      const response = await request(app.server)
        .post('/api/v1/auth/register')
        .send({ name: 'Test User', role: 'user', userName: 'testuser', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Error during registration' });
    });
  });
});
