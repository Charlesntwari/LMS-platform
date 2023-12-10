import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar"

const dashbordLayout = ({ children }: {
    children: React.ReactNode
}) => {
    return ( 
        <div className="h-full">
            <div className="h-[80px] md:pl-60 w-full fixed inset-y-0 z-20">
              <Navbar />
            </div>
            <div className="hidden md:flex w-60 h-full flex-col fixed inset-y-0 z-50">
              <Sidebar />
            </div>
            <main className="md:pl-60 pt-[80px] h-full">
             { children }
            </main>
        </div>
     );
}
 
export default dashbordLayout;