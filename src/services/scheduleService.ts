import prisma from "../models/prismaClient"; // ajuste o caminho conforme necessário
import { Schedule } from "../types";

export const createSchedule = async ({userId,lawyerId,roomId,date,time,type,confirmed = false, }: Schedule) => {

  


  const schedule = await prisma.schedule.create({
    data: {
      userId,
      lawyerId,
      roomId,
      date,
      time,
      type,
      confirmed, 
    },
  });

  return schedule;
};
