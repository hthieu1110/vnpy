export const Page = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{ height: "calc(100vh - 80px)" }}>
            {children}
        </div>
    );
};
