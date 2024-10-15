import { FastifyRequest, FastifyReply } from "fastify";
import * as scheduleService from "../services/scheduleService";
import { GetSchedulesParams, Schedule } from "../types";
import { checkRoomAvailability, validationCreateSchedule } from "../validators/validationsSchedule";

export const createSchedule = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { userId, lawyerId, roomId, date, startTime, type, confirmed } = request.body as Schedule;
    
    // Validação dos campos
    if(!userId || !lawyerId || !roomId || !date || !startTime || !type ) {
      throw new Error("Campos obrigatórios ausentes");
    }

    const parsedDate: Date = new Date(date);
    const dateObject: Date = new Date(startTime);
    const validStartTime: number = dateObject.getUTCHours();
    const dayOfWeek: number = dateObject.getUTCDay(); //(0 = domingo, 6 = sábado)
    const duration: number = type === "hearing" ? 3 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;
    const endTime: Date = new Date(dateObject.getTime() + duration);
    // validação de data e hora
    validationCreateSchedule(dateObject, dayOfWeek, validStartTime, parsedDate, endTime);
    // verificação de disponibilidade da sala
    const isAvailable = await checkRoomAvailability(roomId, parsedDate, dateObject, endTime);

    
    if (!isAvailable) {
      throw new Error("A sala não está disponível para esse horário");
    }

    const schedule = await scheduleService.createSchedule({
      userId,
      lawyerId,
      roomId,
      date: parsedDate,
      startTime: dateObject,
      endTime: endTime,
      type,
      confirmed,
    });

    return reply.code(201).send({ message: "Agendamento criado com sucesso!", schedule });
  } catch (error) {
    return reply.code(500).send({ error: (error as Error).message }); // Usar 500 para erros de servidor
  }
};

export const getAllSchedules = async (request: FastifyRequest<{ Params: GetSchedulesParams }>, reply: FastifyReply) => {
  try {
    const specificDateString = request.params.date; 
    const specificDate = new Date(specificDateString);

    if (isNaN(specificDate.getTime())) {
      return reply.code(400).send({ error: 'Data inválida fornecida' });
    }

    const schedules = await scheduleService.getAllSchedules(specificDate);
    return reply.code(200).send(schedules); 
  } catch (error) {
    return reply.code(500).send({ error: (error as Error).message }); // Usar 500 para erros de servidor
  }
};

export const getScheduleById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const schedule = await scheduleService.getScheduleById(id);
    return reply.code(200).send(schedule); 
  } catch (error) {
    return reply.code(500).send({ error: (error as Error).message }); // Usar 500 para erros de servidor
  }
};


export const updateScheduleById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const { userId, lawyerId, roomId, date, startTime, type, confirmed } = request.body as Schedule;

    // Validação dos campos
    if (!userId || !lawyerId || !roomId || !date || !startTime || !type) {
      return reply.code(400).send({ error: "Campos obrigatórios ausentes" });
    }

    const parsedDate: Date = new Date(date);
    const dateObject: Date = new Date(startTime);
    const validStartTime: number = dateObject.getUTCHours();
    const dayOfWeek: number = dateObject.getUTCDay(); // (0 = domingo, 6 = sábado)
    const duration: number = type === "hearing" ? 3 * 60 * 60 * 1000 : 1 * 60 * 60 * 1000;
    const endTime: Date = new Date(dateObject.getTime() + duration);

    // Validação de data e hora
    validationCreateSchedule(dateObject, dayOfWeek, validStartTime, parsedDate, endTime);

    // Verificação de disponibilidade da sala
    const isAvailable = await checkRoomAvailability(roomId, parsedDate, dateObject, endTime);
    if (!isAvailable) {
      return reply.code(400).send({ error: "A sala não está disponível para esse horário" });
    }

    // Atualizar o agendamento
    const updatedSchedule = await scheduleService.updateScheduleById(id, {
      userId,
      lawyerId,
      roomId,
      date: parsedDate,
      startTime: dateObject,
      endTime: endTime,
      type,
      confirmed,
    });

    return reply.code(200).send({ message: "Agendamento atualizado com sucesso!", schedule: updatedSchedule });
  } catch (error) {
    return reply.code(500).send({ error: (error as Error).message });
  }
};

export const confirmSchedule = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const schedule = await scheduleService.confirmSchedule(id);
    return reply.code(200).send(schedule); 
  } catch (error) {
    return reply.code(500).send({ error: (error as Error).message }); // Usar 500 para erros de servidor
  }
};

export const deleteScheduleById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };
    const schedule = await scheduleService.deleteScheduleById(id);
    return reply.code(200).send(schedule); 
  } catch (error) {
    return reply.code(500).send({ error: (error as Error).message }); // Usar 500 para erros de servidor
  }
};






