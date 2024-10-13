import { FastifyRequest, FastifyReply } from "fastify";
import * as scheduleService from "../services/scheduleService";
import * as roomService from "../services/roomService";
import { Schedule } from "../types";

export const createSchedule = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { userId, lawyerId, roomId, date, time, type, confirmed } = request.body as Schedule;

    const room = await roomService.getRoomById({ roomId });

    if (!room || !room.isAvailable) {
      throw new Error("Sala não disponível");
    }

    const schedule = await scheduleService.createSchedule({ userId, lawyerId, roomId, date, time, type, confirmed });

    reply.code(200).send(schedule);
  } catch (error) {
    reply.code(400).send({ error: (error as Error).message });
  }
};
