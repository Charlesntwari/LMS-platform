"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Pencil } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Course } from "@prisma/client"
import { Combobox } from "@/components/ui/combobox"

interface CategoryFormProps {
    initialData:Course
    courseId: String
    options: {label: string, value: string}[]
}

const formSchema = z.object({ 
    categoryId: z.string().min(1, {
    }),
  })

const CategoryForm = ({initialData, courseId, options}: CategoryFormProps) => {

    const [isEditing,setEditing] = useState(false)
    const toggleEdit = () => setEditing((current) => !current)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || " "
        },
    })

    const {isSubmitting, isValid} = form.formState
    const onSubmit = async ( values: z.infer <typeof formSchema>) => {
        try{
            const response = await axios.patch(`/api/courses/${courseId}`, values)
                toast.success("course updated")
                toggleEdit()
                router.refresh()
        }
        catch{
            toast.error("something went wrong")
         }
    }

    const selectedOption = options.find((option) => option.value === initialData.categoryId)

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between mb-4">
                <span>Course category</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&(
                <p className={cn("text-sx mt-2",!initialData.categoryId && "test-slate-500 italic")}>
                   {selectedOption?.label || "No category"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Combobox
                              options = {...options}
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
 
export default CategoryForm;