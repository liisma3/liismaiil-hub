import ErrorBoundaryComp from "@/components/front/ErrorBoundaryComp";
import Navigation from '@/components/front/Navigation';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'space liismaiil',
    description: 'space liismaiil board stages '
}

function Spacelayout({ children, grid, stage, board }: {
    children: ReactNode, sprint: ReactNode,
    stage: ReactNode, board: ReactNode, grid: ReactNode
}) {
    return (<html lang="en" className='light'>
        <body className={` h-screen w-screen`}>
            <ErrorBoundary fallback={<ErrorBoundaryComp />}>

                <main className='container mx-auto w-full  flex flex-col  justify-start items-center h -full'>
                    <div className='container '>
                        <Navigation />
                    </div>

                    <section className="container flex  border   w-full h-[calc(100vh-7rem)] justify-between items-center" >

                        <div className="flex flex-col justify-start items-start bg-green-200 border shadow-md w-1/4 h-full" >
                            {grid}
                        </div >
                        <div className="flex flex-col justify-between items-start space-y-3 border-3   w-3/4 h-full" >
                            {/* 
                            <div className="flex  justify-start   bg-orange-200 w-full h-full text-medium text-gray-500" >
                                {board}
                            </div> */}

                            {children}

                        </div >

                    </section>
                </main>
            </ErrorBoundary>

        </body>
    </html >
    )
}

export default Spacelayout;
