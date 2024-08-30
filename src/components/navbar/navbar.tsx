import { Link, useNavigate } from '@tanstack/react-router'
import  Logo from '@/assets/insightify-logo.svg'
import  { Button } from '@/components/ui/button'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { validateSession, logout } from '@/service/authApi'
import { useAuthStore } from '@/state/authStore'

const Navbar = () => {

  const navigate = useNavigate()

  const queryClient = useQueryClient()
  const { user } = useAuthStore()


  const logOutHandler = async () => {
    await logout()
    useAuthStore.getState().clearUser()
    queryClient.invalidateQueries({queryKey: ['get-current-user']})
    navigate({to: '/'})
  }


  return (
    <header className='shadow mb-2 bg-slate-50' >
      <div className="max-w-screen-2xl mx-auto py-4 flex items-center justify-between">
        <Link to="/" className='text-4xl flex items-center font-black gap-2'>
          <span><img src={Logo} alt="Insightify Logo" width={42} height={42} /></span>
          <span>Insightify</span>
        </Link>
        <nav className="">
          <ul className="flex md:gap-x-8 items-center">
            {user ? (
              <>
                <li className="">
                  <Link to="/about" className="text-lg [&.active]:font-bold">About</Link>
                </li>
                <li className="">
                  <Link to="/profile" className="text-lg [&.active]:font-bold">Profile</Link>
                </li>
                <li>
                  <Button onClick={logOutHandler}>Logout</Button> 
                </li>
              </>
            ): (
              <>
              <li className="">
                  <Link to="/about" className="text-lg [&.active]:font-bold">About</Link>
              </li>
              <li>
                <Button>
                  <Link to="/login" className="text-lg ">Login</Link>
                </Button>
              </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar