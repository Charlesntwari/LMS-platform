"use client"

import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({column}) =>{
        return(
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Title
                <ArrowUpDown className="ml-2 h-4 w-4"/>
            </Button>
        )
    },
  },
  {
    accessorKey: "price",
    header: ({column}) =>{
        return(
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Price
                <ArrowUpDown className="ml-2 h-4 w-4"/>
            </Button>
        )
    },
  },
  {
    accessorKey: "isPublished",
    header: ({column}) =>{
        return(
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Published
                <ArrowUpDown className="ml-2 h-4 w-4"/>
            </Button>
        )
    },
  },
  {
    id: "actions",
    cell: ({row}) => {
        const { id } = row.original

        return(
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost" className="h-4 w-4 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <Link href={`/teacher/courses/${id}`}>
                        <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2"/>Edit
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
  }
]
