import React, { useState } from "react";
import { FaStore } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { MdOutlinePermMedia } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Shop from "./Shop";
import UsersList from "../users/UsersList";
const SettingsMenu = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [currentTab, setCurrentTab] = useState(location.pathname);


    const handleTabChange = (tab) => {
        setCurrentTab(tab);
        navigate(tab);
    }


    return (
        <>
            <div className="flex flex-col sm:flex-row min-h-screen bg-gray-100 p-6 rounded-lg shadow-sm">
                <div className=" w-auto bg-white text-sm border-gray-200 rounded-lg shadow-sm">
                    <ul className="mt-4">
                        <li onClick={() => handleTabChange("/settings/shop")} className={`${currentTab === "/settings/shop" ? 'text-gray-800 bg-slate-100' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}  font-semibold  tracking-wider py-4 px-10 flex gap-2 items-center cursor-pointer`}><span><FaStore /></span> Shop</li>
                        <li onClick={() => handleTabChange("/settings/users")} className={`${currentTab === "/settings/users" ? 'text-gray-800 bg-slate-100' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}  font-semibold tracking-wider py-4 px-10 cursor-pointer flex gap-2 items-center`}><span><RiUserSettingsLine size={20} /></span> Users</li>
                        <li className="text-gray-600 font-semibold tracking-wider py-4 px-10 hover:text-gray-800 hover:bg-gray-100 cursor-pointer flex gap-2 items-center"><span><MdOutlinePermMedia size={20} /></span> Media</li>
                    </ul>

                </div>
                {currentTab === "/settings/shop" && <Shop />}
                {currentTab === "/settings/users" && <UsersList />}
            </div>
        </>
    )
}

export default SettingsMenu