import * as roomService from "../services/roomService";
import prisma from "../models/prismaClient";

export const checkRoomAvailability = async (roomId: string, date: Date, startTime: Date, endTime: Date) => {
    const room = await roomService.getRoomById({ roomId });
    if (!room || !room.isAvailable) {
      throw new Error("Sala não disponível");
    }
  
    const conflictingSchedules = await prisma.schedule.findMany({
      where: {
        roomId: roomId,
        date: new Date(date),
        OR: [
          { startTime: { gte: startTime, lt: endTime } }, // O novo agendamento começa durante um existente
          { endTime: { gt: startTime, lt: endTime } }, // O novo agendamento termina enquanto um existente começa
          { startTime: { lte: startTime }, endTime: { gte: endTime } }, // O novo agendamento cobre um existente
        ],
      },
    });
  
    return conflictingSchedules.length === 0;
  };
  
export const validationCreateSchedule = (dateObject: Date, dayOfWeek: number, validStartTime: number, parsedDate: Date, endTime: Date) => {
    if (isNaN(dateObject.getTime())) {
      throw new Error("Horário de início inválido");
    }
    if (isNaN(endTime.getTime())) {
      throw new Error("Horário de Fim inválido");
    }
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      throw new Error("Agendamentos não podem ser feitos aos fins de semana");
    }
    if (validStartTime < 8 || validStartTime >= 18) { 
      throw new Error("Horário fora do intervalo de 8h a 18h");
    }
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Data inválida");
    }
  };