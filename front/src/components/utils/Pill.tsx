const Pill = ({
    children,
    onClick,
    pointer = true,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    pointer?: boolean;
}) => {
    return (
        <div
            className={`flex items-center gap-3 p-2 bg-white/50 hover:bg-white/70 transition-colors duration-200 rounded-xl ${
                pointer ? "cursor-pointer" : ""
            } shadow-sm`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Pill;
