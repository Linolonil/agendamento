import { Lawyer } from '@prisma/client';
import prisma from '../models/prismaClient';


export const createLawyer = async ({name, role, oab, phoneNumber, icon}: Lawyer) => {

    return await prisma.lawyer.create({ data:{
        name,
        role,
        oab,
        phoneNumber,        
        icon: icon ? icon : null
    } });
};

export const getLawyers = async () => {
    return await prisma.lawyer.findMany();
};

