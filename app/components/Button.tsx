interface ButtonProp {
    onClick?: () => void,
    disabled?: boolean,
    children?: string
}

export default function Button({ onClick, disabled, children }: ButtonProp) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className="bg-sky-500 hover:bg-sky-700 disabled:bg-sky-300 text-white py-2 px-4 rounded-md">
            {`${children ? children : "Edit"}`}
        </button >
    );
}