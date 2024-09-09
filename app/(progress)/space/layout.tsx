'use client'
import '@/styles/global.css';
import 'react-toastify/dist/ReactToastify.css';
/* import { useEffect, useState } from 'react'; */
import { RootStateType } from '@/store/store';
import '@/styles/global.css';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';

const inter = Inter({ subsets: ['latin'] })

//const Navigation = dynamic(()=> import('@/components/front/Navigation'),{ssr:false})

function Spacelayout({ children, souras, sprint, grid }: {
    children: ReactNode, sprint: ReactNode,
    souras: ReactNode,
    stage: ReactNode, board: ReactNode, grid: ReactNode
}) {

    const { gridSelected, hideNbContext, spaceGridsSelected, evalIndex, shuffeledAyahsContext, orderedAyahsContext, gridIndexContext, evalContext } = useSelector((state: RootStateType) => state.sprint)

    const path = usePathname();
    return (
        <main className='container mx-auto w-full  flex-col  justify-start items-center  min-h-screen '>
            <section className="container flex justify-between  md:items-center w-full   ring-2 ring-yellow-300/80 " >
                <div className="h-52    bg-green-100/70 border border-red-400 flex justify-center items-center 
                        shadow-md " >
                    {souras}
                </div >
                <div className=" bg-emerald-300/30 border border-yellow-200 shadow-md " >
                    {grid}
                </div >
                <div className=" bg-green-100/50 border shadow-md " >
                    {sprint}
                </div >
            </section>
            <section className="container flex-col   w-full max-h-['5rem'  ring-2 ring-red-300/80 justify-start items-center" >

                {gridSelected && gridSelected.arabName != "" && <div className="flex flex-col justify-start items-start scroll-smooth   w-full max-h-[calc(100vh-5rem)]]" >
                    {/* 
                            <div className="flex  justify-start   bg-orange-200 w-full h-full text-medium text-gray-500" >
                            {board}
                            </div> */}

                    {children}

                </div >}

            </section>
        </main>


    )
}

export default Spacelayout;
