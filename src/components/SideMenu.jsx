
import { AiOutlineDashboard } from "react-icons/ai";
import biyayaLogo from "../../src/assets/biyaya_logo.png";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { MdOutlineInventory } from "react-icons/md";
import { IoReceiptOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { faL } from "@fortawesome/free-solid-svg-icons";

export const SideMenu = ({ toggleSideMenu, setToggleSideMenu, setHeaderName, setToggleCart }) => {
  const navigate = useNavigate();



  const navigateMenu = (menuName) => {
    navigate(menuName)
    setHeaderName(menuName)

    menuName === '/dashboard/pos' ? setToggleCart(true) : setToggleCart(false)
  }

  const classToggleSideMenu = toggleSideMenu ? 'w-44 ease-in-out duration-300' : 'w-16 ease-in-out duration-300'

  const content = (
    <>

      <div className={`flex h-full fixed ${classToggleSideMenu}   flex-col justify-between border-e bg-white `}>
        <div className={toggleSideMenu ? `py-6 ease-in-out duration-300` : `py-12 ease-in-out duration-300`}>
          <div className={toggleSideMenu ? `cursor-pointer mx-auto w-20 rounded-lg text-xs text-gray-600  ease-in-out duration-300` : ` ease-in-out duration-300 cursor-pointer mx-auto w-10 rounded-lg text-xs text-gray-600`}
            onClick={() => setToggleSideMenu(!toggleSideMenu)}
          >
            <img src={biyayaLogo} className='' />
          </div>

          <ul className={toggleSideMenu ? `mt-6 ease-in-out duration-300` : `mt-10 ease-in-out duration-300`}>
            <li className={
              location.pathname === '/dashboard'
                ? `border-r-[4px] border-r-gray-800 bg-gray-100 px-4 py-4 cursor-pointer font-sans font-medium  text-gray-700`
                : ` border-r-gray-800  px-4 py-4 cursor-pointer hover:bg-gray-100 font-sans font-medium  text-gray-700`
            }
              onClick={() => navigateMenu('/dashboard')}
            >
              <div className={toggleSideMenu ? `flex gap-5` : `t group relative flex gap-5`}>
                <div className="text-gray-500">
                  <AiOutlineDashboard size={25} />
                </div>
                <div
                  className={toggleSideMenu ? `text-md tracking-wide w-16 ease-in-out duration-300` : ` text-[0px] tracking-wide w-16 ease-in-out duration-300`}
                >
                  Dashboard
                </div>
                <span
                  className="invisible absolute start-full top-[48%] ms-2 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >
                  Dashboard
                </span>
              </div>
            </li>

            <li className={
              location.pathname === '/dashboard/pos'
                ? `border-r-[4px] border-r-gray-800 bg-gray-100 px-4 py-4 cursor-pointer font-sans font-medium  text-gray-700`
                : ` border-r-gray-800  px-4 py-4 cursor-pointer hover:bg-gray-100 font-sans font-medium  text-gray-700`
            }
              onClick={()=> navigateMenu("/dashboard/pos")}
            >
              <div className={toggleSideMenu ? `flex gap-5` : `t group relative flex gap-5`}>
                <div className="text-gray-500">
                  <BsFillMenuButtonWideFill size={25} />
                </div>
                <div
                  className={toggleSideMenu ? `text-md tracking-wide ease-in-out duration-300` : ` text-[0px] tracking-wide ease-in-out duration-300`}
                >
                  POS
                </div>
                <span
                  className="invisible absolute start-full top-[48%] ms-2 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >
                  POS
                </span>
              </div>
            </li>

            <li className={
              location.pathname === '/dashboard/items'
                ? `border-r-[4px] border-r-gray-800 bg-gray-100 px-4 py-4 cursor-pointer font-sans font-medium  text-gray-700`
                : ` border-r-gray-800  px-4 py-4 cursor-pointer hover:bg-gray-100 font-sans font-medium  text-gray-700`
            }
              onClick={() => navigateMenu('/dashboard/items')}
            >
              <div className={toggleSideMenu ? `flex gap-5` : `t group relative flex gap-5`}>
                <div className="text-gray-500">
                  <MdOutlineInventory size={25} />
                </div>
                <div
                  className={toggleSideMenu ? `text-md tracking-wide ease-in-out duration-300` : ` text-[0px] tracking-wide ease-in-out duration-300`}
                >
                  Inventory
                </div>
                <span
                  className="invisible absolute start-full top-[48%] ms-2 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >
                  Inventory
                </span>
              </div>
            </li>

            <li className="font-sans border-r-gray-800 font-medium px-4 py-4 cursor-pointer hover:bg-gray-100 text-gray-700">
              <div className={toggleSideMenu ? `flex gap-5` : `t group relative flex gap-5`}>
                <div className="text-gray-500">
                  <IoReceiptOutline size={25} />
                </div>

                <div
                  className={toggleSideMenu ? `text-md tracking-wide  ease-in-out duration-300` : ` text-[0px] tracking-wide  ease-in-out duration-300`}
                >
                  Orders
                </div>
                <span
                  className="invisible absolute start-full top-[48%] ms-2 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >
                  Orders
                </span>
              </div>
            </li>

            <li className={
              location.pathname === '/dashboard/users'
                ? `border-r-[4px] border-r-gray-800 bg-gray-100 px-4 py-4 cursor-pointer font-sans font-medium  text-gray-700`
                : ` border-r-gray-800  px-4 py-4 cursor-pointer hover:bg-gray-100 font-sans font-medium  text-gray-700`
            }
              onClick={() => navigateMenu("/dashboard/users")}
            >
              <div className={toggleSideMenu ? `flex gap-5` : `t group relative flex gap-5`}>

                <div className="text-gray-500">
                  <IoSettingsOutline size={25} />
                </div>
                <div
                  className={toggleSideMenu ? `text-md tracking-wide  ease-in-out duration-300` : `group text-[0px] tracking-wide  ease-in-out duration-300`}
                >
                  Settings

                </div>
                <span
                  className="invisible absolute start-full top-[48%] ms-2 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
                >
                  Settings
                </span>
              </div>
            </li>

          </ul>
        </div>

        <div className={` border-r-gray-800  px-4 py-4 cursor-pointer hover:bg-gray-100 font-sans font-medium  text-gray-700 sticky inset-x-0 bottom-0 border-t border-gray-100 `
        }
          onClick={() => navigate('/')}
        >
          <div className={toggleSideMenu ? `flex gap-5` : `t group relative flex gap-5`}>
            <div className="text-gray-500">
              <IoIosLogOut size={25} />
            </div>
            <div
              className={toggleSideMenu ? `text-md tracking-wide  ease-in-out duration-300` : `group text-[0px] tracking-wide  ease-in-out duration-300`}
            >
              Logout

            </div>
            <span
              className="invisible absolute start-full top-[48%] ms-2 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
            >
              Logout
            </span>
          </div>
        </div>

      </div>

    </>
  )
  return content
}