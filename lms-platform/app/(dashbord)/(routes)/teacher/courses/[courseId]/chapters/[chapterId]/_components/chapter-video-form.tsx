"use client"

import { useState } from "react"
import * as z from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pencil, PlusCircle } from "lucide-react"
import { Chapter, MuxData } from "@prisma/client"
import { FileUpload } from "@/components/file-upload"

interface ChapterVideoProps {
    initialData: Chapter & {muxData?: MuxData | null}
    courseId: string
    chapterId: string
}

const formSchema = z.object({ 
    videoUrl: z.string().min(1),
  })

const ChapterVideoForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterVideoProps) => {

    const [isEditing,setEditing] = useState(false)
    const toggleEdit = () => setEditing((current) => !current)
    const router = useRouter()

    const onSubmit = async ( values: z.infer <typeof formSchema>) => {
        try{
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
                toast.success("Chapter updated")
                toggleEdit()
                router.refresh()
        }
        catch{
            toast.error("something went wrong")
         }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between mb-4">
                <span>Chapter video</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (!initialData.videoUrl &&(
                        <>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add a video
                        </>
                    )
                    )}
                    {!isEditing && (initialData.videoUrl &&(
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit an video
                        </>
                    )
                    )}
                </Button>
            </div>
            {!isEditing &&  (!initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                   <video className="h-10 w-10 text-slate-500"/>
                </div>
            ):(
                <div className="relative aspect-video mt-2">
                    video uploaded
                </div>
            )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                       endpoint="chapterVideo"
                       onChange={(url) =>{
                        if (url){
                            onSubmit({ videoUrl: url})
                        }
                       }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                      Upload video for this chapter
                    </div>
                </div>

            )}
            {initialData.videoUrl && !isEditing &&(
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take a few minutes to process. 
                    Refresh the page if video does not appear.
                </div>
            )}
         
        </div>
    );
}
 
export default ChapterVideoForm;