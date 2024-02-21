"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
  } from "@/components/ui/form"

interface ChapterTitleFormProps {
    initialData:{
        title: String
    }
    courseId: String
    chapterId:String
}

const formSchema = z.object({ 
    title: z.string().min(1),
  })

const ChapterTitleForm = ({
    initialData,
    courseId,
    chapterId
}: ChapterTitleFormProps) => {

    const [isEditing,setEditing] = useState(false)
    const toggleEdit = () => setEditing((current) => !current)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    })

    const {isSubmitting, isValid} = form.formState
    const onSubmit = async ( values: z.infer <typeof formSchema>) => {
        try{
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
                toast.success("chapter updated")
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
                <span>Chapter title</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit title
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sx mt-2">{initialData.title}</p>
            )}
            {isEditing && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input
                            disabled={isSubmitting}
                            placeholder="introduction of this course"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
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
 
export default ChapterTitleForm;