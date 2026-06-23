import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { email } from "zod";

export const createDefaultAdmin = async () => {
    try {

        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: "admin@example.com",
            },
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        await prisma.user.create({
            data: {
                name: "System Admin",
                email: "admin@example.com",
                password: hashedPassword,
                role: "ADMIN",
            }
        });
        console.log("Admin Created successfully");
    } catch (err) {
        console.log("Failed to create Admin:", err);
    }
}