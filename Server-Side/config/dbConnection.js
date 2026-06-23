import prisma from "./prisma.js";

const connectionDB = async() =>{
    try{
        await prisma.$connect();

        console.log("Database Connected");
    }catch(err){
        console.error("Database Connection Failed");
        console.error(err);

        process.exit(1);
    }
};

export default connectionDB;