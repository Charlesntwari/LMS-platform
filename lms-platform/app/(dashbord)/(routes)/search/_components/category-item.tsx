import { cn } from "@/lib/utils"
import { IconType } from "react-icons"

interface CategoryItemProps {
    label: string;
    icon: IconType;
    value: string;
}

export const CategoryItem = ({
    label,
    icon: Icon,
    value
}: CategoryItemProps) =>{
    return(
        <button
            className={cn("py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",)}
            type="button"
        >
            {Icon && <Icon size={20} />}
            <div className="truncate">
                {label}
            </div>
        </button>
    )
}