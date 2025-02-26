"use client"
import { useRouter } from "next/navigation";
interface Props {
    text: string;
    redirectLink?: string;
    color ?: string;
    hoverColor ?: string;
}

export function Button({ text, redirectLink, color, hoverColor }: Props) {
    const router = useRouter();
    return (
        <button
            onClick={() =>  router.push(`${redirectLink}`)}
            className={`${color ? `${color}` +" "+ `hover: ${hoverColor}` : "bg-primary hover:bg-primary-dark"}  px-6 py-2 rounded-lg transition-colors`}
        >
            {text}
        </button>
    );
}