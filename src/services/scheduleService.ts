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

export const getAllSchedules = async () => {
  const schedules = await prisma.schedule.findMany();
  return schedules;
};
