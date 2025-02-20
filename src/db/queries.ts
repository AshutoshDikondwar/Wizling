import { cache } from "react";
import db from "@/db/drizzle";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { challengeProgress, courses, units, userProgress } from "./schema";


//GET
export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();
    return data
})

export const getUserProgress = cache(async () => {
    const { userId } = await auth();
    if (!userId) return null;

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with: {
            activeCourse: true
        }
    })

    return data;
})

export const getCourseId = cache(async (courseId: number) => {
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, courseId)
    })
    return data;
})

//checking that lesson is completed if completed then we are sending true in fontendi
//all challenges are complete or not for indivisual lesson
export const getUnits = async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();
    if (!userId || !userProgress?.activeCourseId) {
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseId, userProgress.activeCourseId),
        with: {
            lessons: {
                with: {
                    challenges: {
                        with: {
                            challenegeProgress: {
                                where: eq(challengeProgress.userId, userId)
                            },
                        }
                    }
                }
            }
        }
    });

    const normalizedData = data.map((unit) => {
        const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
            const allCompletedChallenges = lesson.challenges.every((challenge) => {
                return challenge.challenegeProgress
                    && challenge.challenegeProgress.length > 0
                    && challenge.challenegeProgress.every((progrss) => progrss.completed)
            });
            return { ...lesson, completed: allCompletedChallenges };
        })
        return { ...unit, lessons: lessonsWithCompletedStatus };
    })
    return normalizedData;
}







