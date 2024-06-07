import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "../db/schema"

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database");
        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Spanish",
                imgSrc: "/es.svg"
            },
            {
                id: 2,
                title: "Italian",
                imgSrc: "/it.svg"
            },
            {
                id: 3,
                title: "French",
                imgSrc: "/fr.svg"
            },
            {
                id: 4,
                title: "Croatian",
                imgSrc: "/hr.svg"
            },
        ])

        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 1, //Spanish,
                title: "Unit 1",
                description: "Learn the basics of Spanish",
                order: 1
            }
        ])

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1, // Unit 1 Learn  the basics,
                order: 1,
                title: "Nouns"
            },
        ])

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1, // Nouns
                type: "SELECT",
                order: 1,
                question: 'Which one of these is "the man"?',
            },
        ])

        await db.insert(schema.challengeOptions).values([
            {
                id:1,
                challengeId:1, // Which one of these is "the man"
                imgSrc:"/man.svg",
                correct:true,
                text:"el hombre",
                audioSrc:"/es_man.mp3"
            },
            {
                id:2,
                challengeId:1, // Which one of these is "the man"
                imgSrc:"/woman.svg",
                correct:false,
                text:"la mujer",
                audioSrc:"/es_woman.mp3"
            },
            {
                id:3,
                challengeId:1, // Which one of these is "the man"
                imgSrc:"/robot.svg",                          
                correct:false,
                text:"el robot",
                audioSrc:"/es_robot.mp3"
            },
        ])

        console.log("Seeding finished");

    } catch (error) {
        console.error(error);
        throw new Error("Failed to seed database")
    }
}

main();

//for running this run as node i.e. node index.js there may be error about import can not be use insted of using require we install below package
//or install tsx package
//now run; npx tsx ./src/scripts/seed.ts