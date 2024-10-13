import { User } from "@prisma/client";
import prisma from "../models/prismaClient";

export const createUser = async ({ name, role, password, userName, iconProfile}: User) => {
  
    const existingUser = await prisma.user.findUnique({
    where: {
      name,
    },
  });

  if (existingUser) {
    throw new Error("Usuário já cadastrado");
  }

  const verifyUsername = await prisma.user.findUnique({
    where:{
        userName
    }
  })

  if(verifyUsername){
    throw new Error("userName Inválido ")
  }

  const userCreated = await prisma.user.create({
    data: {
      name,
      role,
      password,
      userName,
      iconProfile
    },
  });

  return userCreated;
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  if (!users) {
    throw new Error("Erro ao buscar advogados");
  }
  return users;
};

export const getUserById = async ({ id }: { id: string }) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new Error("Erro ao buscar Usuário");
  }
  return user;
};

export const updateUser = async ({ id, name, userName, password, role, iconProfile }: User & { id: string }) => {
    const user = await prisma.user.findFirst({
      where: { id },
    });
  
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
  
    const verifyConflictUserName = await prisma.user.findFirst({
      where: {
        userName,
        NOT: { 
            id
         }, 
      },
    });
  
    if (verifyConflictUserName) {
      throw new Error("UserName já está em uso");
    }
  
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        userName,
        password,
        role,
        iconProfile,
      },
    });
  
    return updatedUser;
  };
  

export const deleteUser = async ({ id }: { id: string }) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const userDeleted = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  if (!userDeleted) {
    throw new Error("Erro ao deletar usuário");
  }

  return userDeleted;
};
