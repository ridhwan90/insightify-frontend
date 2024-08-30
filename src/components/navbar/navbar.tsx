import { Link } from '@tanstack/react-router'
import  Logo from '@/assets/insightify-logo.svg'
import  { Button } from '@/components/ui/button'

const Navbar = () => {
  return (
    <header className='shadow mb-2 bg-slate-50' >
      <div className="max-w-screen-2xl mx-auto py-4 flex items-center justify-between">
        <Link to="/" className='text-4xl flex items-center font-black gap-2'>
          <span><img src={Logo} alt="Insightify Logo" width={42} height={42} /></span>
          <span>Insightify</span>
        </Link>
        <nav className="">
          <ul className="flex md:gap-x-8 items-center">
            <li className="">
              <Link to="/about" className="text-lg [&.active]:font-bold">About</Link>
            </li>
            <li className="">
              <Link to="/profile" className="text-lg [&.active]:font-bold">Profile</Link>
            </li>
            <li className="">
              <Button>
                <Link to="/login" className="text-lg ">Login</Link>
              </Button>       
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar