import { Lawyer } from "@prisma/client";
import prisma from "../models/prismaClient";

export const createLawyer = async ({ name, oab, phoneNumber }: Lawyer) => {
  const existingLawyer = await prisma.lawyer.findUnique({
    where: {
      oab,
    },
  });

  if (existingLawyer) {
    throw new Error("Advogado já cadastrado");
  }

  const phone = phoneNumber?.trim() === "" ? "92000000000" : phoneNumber;

  const lawyerCreated = await prisma.lawyer.create({
    data: {
      name,
      oab,
      phoneNumber: phone,
    },
  });

  return lawyerCreated;
};

export const getLawyers = async () => {
  const lawyers = await prisma.lawyer.findMany();
  if (!lawyers) {
    throw new Error("Erro ao buscar advogados");
  }
  return lawyers;
};

export const getLawyersByOab = async ({ oab }: { oab: string }) => {
  const lawyers = await prisma.lawyer.findUnique({
    where: {
      oab: oab,
    },
  });

  if (!lawyers) {
    throw new Error("Erro ao buscar advogados");
  }
  return lawyers;
};

export const updateLawyers = async ({ id, name, oab, phoneNumber }: Lawyer & { id: string }) => {
  const lawyer = await prisma.lawyer.findFirst({
    where: {
      id: id,
    },
  });

  if (!lawyer) {
    throw new Error("Advogado não encontrado");
  }

  const verifyConflictOab = await prisma.lawyer.findUnique({
    where: {
      oab: oab,
    },
  });
  
  if (verifyConflictOab && verifyConflictOab.id !== id) {
    throw new Error("OAB informada já existe");
  }

  const newName = name !== lawyer.name ? name : lawyer.name;
  const newOab = oab !== lawyer.oab ? oab : lawyer.oab;
  const newPhoneNumber = phoneNumber !== lawyer.phoneNumber ? phoneNumber : lawyer.phoneNumber;

  const updatedLawyer = await prisma.lawyer.update({
    where: {
      id: id,
    },
    data: {
      name: newName,
      oab: newOab,
      phoneNumber: newPhoneNumber,
    },
  });

  if (!updatedLawyer) {
    throw new Error("Erro ao atualizar o Advogado");
  }

  return updatedLawyer;
};

export const deleteLawyers = async ({ id }: { id: string }) => {
  const lawyer = await prisma.lawyer.findFirst({
    where: {
      id: id,
    },
  });

  if (!lawyer) {
    throw new Error("Advogado não encontrado");
  }

  const lawyerDeleted = await prisma.lawyer.delete({
    where: {
      id: id,
    },
  });

  if (!lawyerDeleted) {
    throw new Error("Erro ao deletar usuário");
  }

  return lawyerDeleted;
};
