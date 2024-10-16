import { FastifyReply, FastifyRequest } from "fastify";
import * as authService from "../services/authService";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../utils/jwt";
import { User } from "../types";

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { userName, password, checkPassword } = request.body as {
    userName: string;
    password: string;
    checkPassword: string;
  };

  // Verifique se os campos obrigatórios estão presentes
  if (!userName || !password || !checkPassword) {
    console.log("Campos obrigatórios não informados");
    return reply.status(400).send({ message: "Campos obrigatórios não informados" });
  }

  // Verifique se as senhas conferem
  if (checkPassword !== password) {
    console.log("As senhas não conferem");
    return reply.status(401).send({ message: "As senhas não conferem" });
  }

  try {
    // Tente fazer o login
    const { user, accessToken, refreshToken } = await authService.loginService(userName, password);
    console.log("Usuário autenticado:", user);
    reply.status(200).send({ user, accessToken, refreshToken });
  } catch (error) {
    console.error("Erro ao fazer login:", error); // Log do erro
    if ((error as Error).message === "Credenciais inválidas") {
      return reply.status(401).send({ message: (error as Error).message });
    }
    reply.status(500).send({ message: "Erro interno do servidor", error: (error as Error).message });
  }
};

export const refreshToken = async (request: FastifyRequest, reply: FastifyReply) => {
  const { refreshToken } = request.body as { refreshToken: string };

  if (!refreshToken) {
    return reply.status(401).send("Refresh Token Required");
  }

  try {
    const userData = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as {
      userId: string;
      userName: string;
      role: string;
    };

    const accessToken = generateAccessToken(userData.userId, userData.userName, userData.role);
    return reply.send({ accessToken });
  } catch (error) {
    return reply.status(403).send("Invalid Refresh Token");
  }
};

export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
  const { name, role, userName, password } = request.body as User;

  if (!name || !role || !userName || !password) {
    return reply.status(400).send({ message: "Campos obrigatórios não informados" });
  }

  try {
    const user = await authService.registerService({
      name,
      role,
      userName,
      password,
    } as User);
    reply.code(201).send(user);
  } catch (error) {
    reply.code(400).send({ message: (error as Error).message });
  }
};
