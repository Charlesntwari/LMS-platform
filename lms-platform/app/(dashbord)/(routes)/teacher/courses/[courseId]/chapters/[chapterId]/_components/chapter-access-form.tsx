"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Chapter } from "@prisma/client"
import { Editor } from "@/components/editor"
import { Preview } from "@/components/preview"
import { Checkbox } from "@/components/ui/checkbox"

interface ChapterAccessFormProps {
    initialData: Chapter
    courseId: String
    chapterId: String
}

const formSchema = z.object({ 
    isFree: z.boolean().default(false)
  })

const ChapterAccessForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterAccessFormProps) => {

    const [isEditing,setEditing] = useState(false)
    const toggleEdit = () => setEditing((current) => !current)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: Boolean(initialData.isFree)
        },
    })

    const {isSubmitting, isValid} = form.formState
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
                <span>Chapter Access Settings</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Access
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&(
                <p className={cn("text-sx mt-2",!initialData.isFree && "test-slate-500 italic")}>
                   {!initialData.isFree ?(
                    <>This chapter is free for preview</>
                   ) : (
                    <>this chapter is not free</>
                   )}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                /> 
                            </FormControl>          
                            <div className="space-y-1 leading-none">
                                <FormDescription>
                                    check this box if you want to make this chapter free for preview
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                    />
                {isEditing && (
                <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="mt-4"
                >
                Save
                </Button>
            )}
                </form>
                </Form>
            )}
         
        </div>
    );
}
 
export default ChapterAccessForm;