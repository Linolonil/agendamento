export interface Schedule {
    id: string;             // ID do agendamento, gerado automaticamente como UUID
    date: Date;             // Data do agendamento (sem tempo)
    startTime: Date;        // Hora de início do agendamento (com data e tempo)
    endTime: Date;          // Hora de término do agendamento (com data e tempo)
    type: ScheduleType;     // Tipo de agendamento (enum ScheduleType)
    confirmed: boolean;     // Status de confirmação do agendamento
    userId: string;         // ID do usuário associado
    lawyerId: string;       // ID do advogado associado
    roomId: string;         // ID da sala associada
    createdAt: Date;        // Data de criação (automática)
    updatedAt: Date;        // Data da última atualização (automática)
  }

  enum ScheduleType {
    HEARING = 'hearing',
    MEETING = 'meeting',
  }
  