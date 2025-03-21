import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma ?: PrismaClient};

const client = globalForPrisma.prisma ?? new PrismaClient();
if(!globalForPrisma.prisma) globalForPrisma.prisma = client;

export default client;