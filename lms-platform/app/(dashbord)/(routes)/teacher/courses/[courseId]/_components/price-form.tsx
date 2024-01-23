"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { formatPrice } from "@/lib/format"

interface PriceFormProps {
    initialData:Course
    courseId: String
}

const formSchema = z.object({ 
    price: z.coerce.number()
  })

const PriceForm = ({initialData, courseId}: PriceFormProps) => {

    const [isEditing,setEditing] = useState(false)
    const toggleEdit = () => setEditing((current) => !current)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined
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

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between mb-4">
                <span>Course price</span>
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit price
                        </>
                    )}
                </Button>
            </div>
            {!isEditing &&(
                <p className={cn("text-sx mt-2",!initialData.price && "test-slate-500 italic")}>
                   {initialData.price? formatPrice(initialData.price) : "No price"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input
                              type="number" 
                              step="0.01"
                              disabled={isSubmitting}
                              placeholder=" set course price"
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
 
export default PriceForm;