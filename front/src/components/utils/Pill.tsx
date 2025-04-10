const Pill = ({
    children,
    pointer = true,
}: {
    children: React.ReactNode;
    pointer?: boolean;
}) => {
    return (
        <div
            className={`flex items-center gap-3 px-4 py-2 bg-white/50 hover:bg-white/70 transition-colors duration-200 rounded-xl ${
                pointer ? "cursor-pointer" : ""
            } shadow-sm`}
        >
            {children}
        </div>
    );
};

export default Pill;
