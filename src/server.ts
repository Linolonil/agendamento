import fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/authRoutes';
import { lawyerRoutes } from './routes/lawyerRoutes';
import { roomRoutes } from './routes/roomRoutes';
import { userRoutes } from './routes/userRoutes';
import { scheduleRoutes } from './routes/scheduleRoutes';

dotenv.config();

const app = fastify({ logger: true });

app.setErrorHandler((error, request, reply) => {
    reply.code(400).send({ message: error.message });
});

const start = async () => {
    try {
        await app.register(cors);
        
        app.register(authRoutes);
        app.register(lawyerRoutes);
        app.register(roomRoutes);
        app.register(userRoutes)
        app.register(scheduleRoutes)

        const port =  Number(process.env.PORT) || 3333;
        await app.listen({ port: port });
        console.log(`Server is running on http://localhost:${port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
