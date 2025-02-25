import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className='flex justify-center items-center my-24 h-screen w-screen bg-gray-100'>
  
  <SignIn />
    </div>
}