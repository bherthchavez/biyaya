import biyayaLogo from "../../src/assets/biyaya_logo.png";
import { MdDashboard, MdDashboardCustomize, MdOutlineInventory, MdSpaceDashboard } from "react-icons/md";
import { IoReceiptOutline, IoSettingsOutline } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import Spinner from "./Spinner";
import PageError from "./PageError";
import MenuItem from "./MenuItem";
import { IoIosLogOut } from "react-icons/io";
import { POSContext } from "../context/POSContext";
import { useContext } from "react";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import { RxDashboard } from "react-icons/rx";
import { VscGraph } from "react-icons/vsc";

export const SideMenu = ({ toggleSideMenu, setToggleSideMenu, setHeaderName }) => {


  const { setHeadSearch, orderTransac, setToggleCart,
  } = useContext(POSContext);

  const location = useLocation();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [sendLogout, { isLoading, isError, error }] = useSendLogoutMutation();

  const navigateMenu = (menuName) => {
    navigate(menuName);
    setHeaderName(menuName);
  };

  const logOutUser = async () => {
    const logout = await sendLogout();
    if (logout?.data) navigate("/");
  };

  if (isError) return <PageError error={error?.data?.message} />;

  const onMenuClick = (path) => {
    navigateMenu(path)

    if (path === "/pos" && orderTransac?.items.length) {
      setToggleCart(true)
    } else {
      setHeadSearch('')
      setToggleCart(false)
    }
  }

  const classToggleSideMenu = toggleSideMenu ? "w-16 lg:w-40" : "w-16";

  return (
    <div className={`z-40 flex h-full no-print fixed ${classToggleSideMenu} flex-col justify-between border border-gray-200 bg-white ease-in-out duration-300`}>
      <div className={`${toggleSideMenu ? "py-5 lg:py-5" : "py-7"} ease-in-out duration-300`}>
        <div
          className={`cursor-pointer mx-auto w-10 ${toggleSideMenu && "lg:w-16" } rounded-lg text-xs text-gray-600 ease-in-out duration-300`}
          onClick={() => setToggleSideMenu(!toggleSideMenu)}
        >
          <img src={biyayaLogo} alt="Logo" />
        </div>
        
        <ul className={`${toggleSideMenu ? "mt-5 lg:mt-3" : "mt-7"} ease-in-out duration-300`}>
          <MenuItem
            icon={MdDashboardCustomize}
            label="Dashboard"
            path="/dashboard"
            toggleSideMenu={toggleSideMenu}
            isActive={location.pathname === "/dashboard"}
            onClick={() => onMenuClick("/dashboard")}
          />
          <MenuItem
            icon={BsFillMenuButtonWideFill}
            label="POS"
            path="/pos"
            toggleSideMenu={toggleSideMenu}
            isActive={location.pathname === "/pos"}
            onClick={() => onMenuClick("/pos")}
          />
          {isAdmin && (
            <>
              <MenuItem
                icon={MdOutlineInventory}
                label="Inventory"
                path="/inventory"
                toggleSideMenu={toggleSideMenu}
                isActive={
                  location.pathname.startsWith("/inventory") || location.pathname === "/inventory/new"
                }
                onClick={() => onMenuClick("/inventory")}
              />
              <MenuItem
                icon={IoReceiptOutline}
                label="Orders"
                path="/orders"
                toggleSideMenu={toggleSideMenu}
                isActive={location.pathname.startsWith("/orders") || location.pathname === "/orders/new"}
                onClick={() => onMenuClick("/orders")}
              />
              <MenuItem
                icon={VscGraph}
                label="Reports"
                path="/reports"
                toggleSideMenu={toggleSideMenu}
                isActive={location.pathname.startsWith("/reports") || location.pathname === "/reports/new"}
                onClick={() => onMenuClick("/reports")}
              />
              <MenuItem
                icon={IoSettingsOutline}
                label="Settings"
                path="/settings"
                toggleSideMenu={toggleSideMenu}
                isActive={location.pathname.startsWith("/settings/")}
                onClick={() => onMenuClick("/settings/shop")}
              />
              
            </>
          )}

        </ul>
      </div>
      <div
        className={`border-r-gray-800  cursor-pointer hover:bg-gray-100 font-sans font-medium text-gray-700 sticky inset-x-0 bottom-0 border-t border-gray-100`}
        onClick={logOutUser}
      >
        {isLoading ? (
          <div className="flex text-gray-500 justify-center py-4 font-normal text-xs h-full w-full items-center p-2">
            <Spinner />
            <p className="hidden lg:flex">Logging Out...</p>
          </div>
        ) : (
          <MenuItem
            icon={IoIosLogOut}
            label="Logout"
            toggleSideMenu={toggleSideMenu}
            isActive={false}
          />
        )}
      </div>
    </div>
  );
};
