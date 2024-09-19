'use client'
import { CoordsType } from '@/api/graphql/profile/profile.types'
import { CollaboratorProfileType } from '@/store/slices/profileSlice'
import { RootStateType } from '@/store/store'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react-hooks/exhaustive-deps

type CountryCityCoords = {
    country: string,
    addressGeo: string,
    state: string,
    host: string,
    coords: CoordsType
}

// -----------------------------COMPONENT-------------------------//
function Organisation({ profile }: { profile: CollaboratorProfileType }) {
  const [countries, setCountries] = useState(() => ['DZ', 'MA', 'FR']);

    console.log({ profile });

    const router = useRouter()

    function selectOrganisationHandler(org: CollaboratorProfileType) {
        router.push(`/stages/${org.tokenId}`)
    }



    return (
        <div className='border  cursor-pointer hover:animate-zoomIn
                    border-green-300  shadow-md shadow-green-300/30 
                    hover:border-indigo-300 
                      transition-all duration-300 ease-in-out
                     flex flex-col gap-1 
                     justify-start 
                     items-center
                     size-48
                     p-2 
                     rounded-lg
                     ' onClick={() => selectOrganisationHandler(profile)} >
            <div className='size-40 w-full  rounded-lg'
                style={{ "backgroundImage": `url(${profile?.flag})` }} >

            </div>
            <div className={`px-auto   text-center  text-xl   w-full font-light`}>
                {profile?.name?.split(' ')[0]}
            </div>
            <div className={`px-auto   text-center  text-xl   w-full font-light`}>
                {profile?.addressGeo?.split(' ')[-1]}
            </div>
            <div className='px-auto  text-xl text-center  capitalize w-full font-light'>
                {profile?.phone}
            </div>
        </div>)
}
export default Organisation