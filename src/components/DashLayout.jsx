import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import { SideMenu } from "./SideMenu";
import { useContext, useState } from "react";
import { Cart } from "../features/pos/Cart";
import { ToastContainer } from "react-toastify";
import { POSContext } from "../context/POSContext";


const DashLayout = () => {

  const { toggleCart } = useContext(POSContext);
  const [toggleSideMenu, setToggleSideMenu] = useState(true)
  const [headerName, setHeaderName] = useState(location.pathname)



  const classToggleSideMenu = toggleSideMenu ? `ml-16 lg:ml-40 ease-in-out duration-300` : `ml-16 ease-in-out duration-300`
  const classToggleCart = toggleCart ? 'mr-0 lg:mr-80  ease-in-out duration-300' : 'mr-0 ease-in-out duration-300'

  return (
    <>
      <div className="flex">
        
        <SideMenu toggleSideMenu={toggleSideMenu} setToggleSideMenu={setToggleSideMenu} setHeaderName={setHeaderName} />

        <div aria-label="Site Header" className={`${classToggleSideMenu} ${classToggleCart} h-full w-full`}>
          <DashHeader headerName={headerName} />
          <ToastContainer />
          <Cart />
          <Outlet />
        </div>
      </div>
    </>
  )
};

export default DashLayout;
