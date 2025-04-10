const Box = ({
    header,
    children,
}: {
    header: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="bg-[#CCD5AE] rounded-2xl m-4 pb-5 px-3 w-3/4 flex flex-col shadow-lg">
            <h2 className="text-2xl font-semibold px-5 pt-5 pb-3 border-b border-[#b5c0a1] text-left">
                {header}
            </h2>
            <div className="flex flex-col items-center justify-center gap-3 mt-3">
                {children}
            </div>
        </div>
    );
};

export default Box;
