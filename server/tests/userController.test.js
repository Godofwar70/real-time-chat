// tests/userController.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Asegúrate de que esto apunta a tu archivo index.js
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const { connect, closeDatabase, clearDatabase } = require('./setup');

describe('User API', () => {
    beforeAll(async () => {
        await connect();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    afterEach(async () => {
        await clearDatabase();
    });

    describe('POST /api/auth/register', () => {
        it('debería registrar un nuevo usuario', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'newuser',
                    email: 'newuser@example.com',
                    password: 'newpassword'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toBe(true);

            const user = await User.findOne({ username: 'newuser' });
            expect(user).not.toBeNull();
            expect(user.email).toBe('newuser@example.com');
        });

        it('debería fallar al registrar un usuario con un nombre de usuario existente', async () => {
            const user = new User({
                username: 'existinguser',
                email: 'existinguser@example.com',
                password: await bcrypt.hash('existingpassword', 10)
            });
            await user.save();

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'existinguser',
                    email: 'newemail@example.com',
                    password: 'newpassword'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.status).toBe(false);
            expect(res.body.msg).toBe('Username already used');
        });
    });

    describe('GET /api/auth/allusers/:id', () => {
        it('debería obtener todos los usuarios excepto el especificado', async () => {
          const user1 = new User({
            username: 'user1',
            email: 'user1@example.com',
            password: await bcrypt.hash('password1', 10),
            avatarImage: 'avatar1.png',
          });
          await user1.save();
    
          const user2 = new User({
            username: 'user2',
            email: 'user2@example.com',
            password: await bcrypt.hash('password2', 10),
            avatarImage: 'avatar2.png',
          });
          await user2.save();
    
          const user3 = new User({
            username: 'user3',
            email: 'user3@example.com',
            password: await bcrypt.hash('password3', 10),
            avatarImage: 'avatar3.png',
          });
          await user3.save();
    
          const res = await request(app)
            .get(`/api/auth/allusers/${user1._id}`); // Obteniendo todos los usuarios excepto user1
    
          expect(res.statusCode).toEqual(200);
          expect(res.body.length).toBe(2);
    
          const usernames = res.body.map(user => user.username);
          expect(usernames).toContain('user2');
          expect(usernames).toContain('user3');
          expect(usernames).not.toContain('user1');
        });
      });
}
);
