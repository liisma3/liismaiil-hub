'use client'
import { RootStateType } from '@/store/store';

import { signinGuest } from "@/actions/auth";
import Submit from "@/components/auth/Submit";
import Link from 'next/link';
import { redirect } from "next/navigation";
import { useFormState } from "react-dom";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
 
const initialState = {
  tokenId : null 
}

const SignIn = () => {
  const { hostToken,country } = useSelector((state: RootStateType) => state.profile)
  const [formState, action] = useFormState<{
    password:string,
    tokenId: string,
  }>(signinGuest, initialState)
 
  const dispatch = useDispatch()
 
  return (<div className='flex relative  flex-col w-full h-screen justify-center items-center gap-3'>
    <form className="loginForm" action={action}>
      <div className='flex flex-col w-full h-full justify-center items-left gap-3 '>
        
        <div className='flex   justify-between items-center  gap-6 rounded-md'>
          <label htmlFor={'token'} className="text-center "> token: </label>
          <input  type="text" name={'tokenId'} id={'token'} className="border  w-full flex justify-end  rounded-md " required />
        </div>
        <div className='flex justify-between items-center  gap-6 rounded-md'>
          <label htmlFor={'password'} className="text-left "> password: </label>
          <input  type="password" name={'password'} id={'password'} className="border  w-full flex justify-end  rounded-md " required />
        </div>
        <div className='flex justify-center items-center '>
          <Submit label={'Sign In'} />


        </div>
        <div className='flex justify-center items-center '>

          <Link href={'/signUp'} className='text-blue-400
   text-center p-2'> {`Not have any account yet ? `}</Link>

        </div>
        {formState && formState?.tokenId &&
          toast.info(`${JSON.parse(formState.tokenId)['tokenId']} successfully signin`) && redirect(`/stages/${formState.tokenId}`)}

      </div>
    </form>
  </div>
  )
}
{/* Login.getLayout = function getLayout({ page, pageProps }) {
  return ( {page}</AppLayout>)
}
 */}
export default SignIn;
