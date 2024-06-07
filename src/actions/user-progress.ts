"use server"

import db from "@/db/drizzle";
import { getCourseId, getUserProgress } from "@/db/queries";
import { userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
        throw new Error("Unauthorized")
    }

    const course = await getCourseId(courseId);
    if (!course) {
        throw new Error("Course not found")
    }
    // if(!course.units.length || !course.units[0].length){
    //     throw new Error("Course is empty")
    // }
    const existingUserProgress = await getUserProgress();
    if (existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImgSrc: user.imageUrl || "/mascot.svg"
        })
        revalidatePath("/courses")
        revalidatePath("/learn")
        redirect("/learn") // this will break the method and we will not go further
    }

    await db.insert(userProgress).values({
        userId: userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImgSrc: user.imageUrl || "/mascot.svg"
    })
    //as we used cache in query it jus used to after update it should revalidate them
    revalidatePath("/courses")
    revalidatePath("/learn")
    redirect("/learn")
}