"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { ConfirmModal } from "@/components/modal/confirm-modal"
import toast from "react-hot-toast"




interface ActionsProps {
    disabled: boolean,
    courseId: string,
    isPublished: boolean
}
export const Actions = ({
    disabled,
    courseId,
    isPublished
}:ActionsProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}`)
            
            toast.success("Course Deleted")
            router.refresh()
            router.push(`/teacher/courses`)
        } 
        catch {
            toast.error("something went wrong")    
        }
        finally{
            setIsLoading(false)
        }
    }
    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={() => {}}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm">
                {isPublished ? "unpublish" : "publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4"/>
                </Button>
            </ConfirmModal>
        </div>
    ) 
}