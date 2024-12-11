import { type Session } from 'next-auth'

//import { SignOut } from "./Auth";
import SignOut from './Auth/SignOut'
import SignIN from './Auth/Signin'
import Form from './form'
//import { SignIn } from './Auth'

export default function LoginForm({ session }: { session: Session | null }) {
  // for the `session` to be available on first SSR render, it must be
  // fetched in a Server Component and passed down as a prop
  return session ? (
    <>
      <Form />
      <SignOut />
    </>
  ) : (
    <>
      <SignIN />
    </>
  )
}
