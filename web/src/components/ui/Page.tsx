type PageProps = {
    children: React.ReactNode;
    className?: string;
}

export const Page = ({ children, className }: PageProps) => {
    return (
        <div style={{ height: "calc(100vh - 80px)" }} className={className}>
            {children}
        </div>
    );
};
