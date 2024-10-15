import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: FastifyRequest, reply: FastifyReply, done: Function) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ message: 'Token não fornecido ou inválido' });
  }
  const token = authHeader.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ message: 'Token não encontrado' });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return reply.status(401).send({ message: 'Token inválido' });
    }

    req.user = decoded; 
    done(); 
  });
};

export default authMiddleware;
