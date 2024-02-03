"use client"

import { useState } from "react"
import * as z from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Attachment, Course } from "@prisma/client"
import { FileUpload } from "@/components/file-upload"

interface AttachmentFormProps {
    initialData:Course & { attachments: Attachment[] }
    courseId: string
}

const formSchema = z.object({ 
     Url: z.string().min(1),
  })

const AttachmentForm = ({initialData, courseId}: AttachmentFormProps) => {

    const [isEditing,setEditing] = useState(false)
    const toggleEdit = () => setEditing((current) => !current)
    const router = useRouter()

    const onSubmit = async ( values: z.infer <typeof formSchema>) => {
        try{
            const response = await axios.post(`/api/courses/${courseId}/attachemnts`, values)
                toast.success("course updated")
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
                <span>Course Attachments</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add file
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&  (
                <>
                   {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                           No attachments yet
                        </p>
                    )}
                </>                
            )}
            {isEditing && (
                <div>
                    <FileUpload
                       endpoint="courseAttachment"
                       onChange={(url) =>{
                        if (url){
                            onSubmit({ Url: url})
                        }
                       }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                      add all necessary files to complete this course.
                    </div>
                </div>

            )}
         
        </div>
    );
}
 
export default AttachmentForm;