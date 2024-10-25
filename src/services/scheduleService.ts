import { Schedule } from "@prisma/client";
import prisma from "../models/prismaClient"; // ajuste o caminho conforme necessário

export const createSchedule = async (data: {
  userId: string;
  lawyerId: string;
  roomId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: "meeting" | "hearing";
  confirmed: boolean;
}) => {

  const schedule = await prisma.schedule.create({
    data: {
    ...data,
    },
  });

  return schedule;
};

export const getAllSchedules = async (specificDate: Date) => {
  const startOfDay = new Date(specificDate.setUTCHours(0, 0, 0, 0)); 
  const endOfDay = new Date(specificDate.setUTCHours(23, 59, 59, 999)); 
console.log(startOfDay, endOfDay)
  const schedules = await prisma.schedule.findMany({
    where: {
      date: {
        gte: startOfDay, 
        lte: endOfDay,   
      },
    },
    orderBy: [
      {
        date: "asc"
      },
      {
        startTime: "asc"
      }
    ]
  });

  return schedules;
};

export const getScheduleById = async (id: string) => {
  const schedule = await prisma.schedule.findUnique({
    where: {
      id: id,
    },
  });
  return schedule;
};

export const deleteScheduleById = async (id: string) => {
  const scheduleExists = await prisma.schedule.findUnique({
    where: { id },
  });

  if (!scheduleExists) {
    throw new Error("Agendamento não encontrado");
  }

  const schedule = await prisma.schedule.delete({
    where: {
      id: id,
    },
  });

  return schedule;
};

export const updateScheduleById = async (id: string, updateData: Partial<Schedule>) => {
  const scheduleExists = await prisma.schedule.findUnique({
    where: { id },
  });

  if (!scheduleExists) {
    throw new Error("Agendamento não encontrado");
  }

  const updatedSchedule = await prisma.schedule.update({
    where: { id },
    data: updateData,
  });

  return updatedSchedule;
};

export const confirmSchedule = async (id: string) => {
  const scheduleExists = await prisma.schedule.findUnique({
    where: { id },
  });

  if (!scheduleExists) {
    throw new Error("Agendamento não encontrado");
  }

  // Alternar o estado de "confirmed"
  const updatedSchedule = await prisma.schedule.update({
    where: { id },
    data: {
      confirmed: !scheduleExists.confirmed,
    },
  });

  return updatedSchedule;
};

