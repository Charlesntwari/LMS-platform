import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { title } from "process";
import { getProgress } from "./get-progress";

type CourseWithprogressWithCategory = Course & {
    category: Category | null;
    chapters: {id: string}[];
    progress: number | null;
} 

type GetCourse = {
    userId: string;
    title?: string;
    categoryId?: string;
}

export const getCourses = async({
    userId,
    title,
    categoryId
}: GetCourse): Promise<CourseWithprogressWithCategory[]> => {
    try {

        const courses = await db.course.findMany({
            where:{
                isPublished: true,
                title:{
                    contains: title,
                },
                categoryId,
            },
            include:{
                category: true,
                chapters:{
                    where:{
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases:{
                    where:{
                        userId,
                    }
                }
            },
            orderBy:{
                createdAt: "desc"
            }
        }) 

        const coursesWithProgress: CourseWithprogressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (course.purchases.length === 0){
                    return {
                        ...course,
                        progress: null,
                    }
                }

                const progressPercentage = await getProgress(userId, course.id)

                return{
                    ...course,
                    progress: progressPercentage
                }
            })
        )

        return coursesWithProgress
        
    } catch (error) {
        console.log("GET COURSES", error)
        return [];
    }
}