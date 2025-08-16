import React from "react";

interface TextInputProps {
    id: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
    disabled?: boolean
    className?: string
}

export default function TextInput({ id, value, setValue, disabled, className }: TextInputProps) {
    return (
        <input id={id} value={value} onChange={(e) => setValue(e.target.value)} disabled={disabled}
            className={`border rounded-md px-1 py-2 disabled:bg-gray-200 ${className}`} />
    );
}