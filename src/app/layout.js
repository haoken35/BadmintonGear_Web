import { UserProvider } from "@/contexts/UserContext"
export default function UserLayout({ children }) {
    return (
        <html lang="en" >
            <body >
                <UserProvider>
                    {children}
                </UserProvider>
            </body>
        </html>
    );
}