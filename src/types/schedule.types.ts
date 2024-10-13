export interface Schedule {
    userId: string;
    lawyerId: string;
    roomId: string;
    date: Date; 
    time: string;
    type: "meeting" | "hearing";
    confirmed?: boolean; 
  }
