import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import ChapterTitleForm from "./_components/chapter-title-form";
import ChapterDescriptionForm from "./_components/chapter-description-form";
import ChapterAccessForm from "./_components/chapter-access-form";
import ChapterVideoForm from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";

const ChapterIdPage =  async(
    {params}:{ params: {courseId: string; chapterId: string }}
) => {
    const userId = auth()
    if (!userId){
        return redirect ("/")
    }

    const chapter = await db.chapter.findUnique({
        where:{
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true,
        }
    })

    if(!chapter){
        return redirect("/")
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl
    ]

    const totaFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totaFields})`

    const isComplete = requiredFields.every(Boolean)

    return(
        <>
            {!chapter.isPublished && (
                <Banner
                  variant="warning"
                  label="This chapter is unpublished. It will not be visible at the course"
                  />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-sm hover:text-sky-700 opacity-75 transition mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2"/>
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Chapter Creation
                                </h1>
                                <span className="text-sm text-slate-700">
                                    complete all fields {completionText}
                                </span>
                            </div>
                            <ChapterActions
                            disabled={!isComplete}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                            isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <LayoutDashboard className="text-sky-600"/>
                                <h2 className="text-xl">
                                    customize your Chapter
                                </h2>
                            </div>
                            <div>
                                <ChapterTitleForm
                                    initialData={chapter}
                                    courseId={params.courseId}
                                    chapterId={params.chapterId}
                                />
                                <ChapterDescriptionForm
                                    initialData={chapter}
                                    courseId={params.courseId}
                                    chapterId={params.chapterId}
                                />
                            </div>
                            <div className="flex items-center gap-x-2 mt-4">
                                <Eye className="text-sky-600"/>
                                <h2 className="text-xl">
                                    Access Settings
                                </h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                            <div className="flex items-center gap-x-2 mt-4">
                                <Video className="text-sky-600"/>
                                <h2 className="text-xl">
                                    Add a Video
                                </h2>
                            </div>
                            <ChapterVideoForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    
}

export default ChapterIdPage