import React, { useContext, useEffect, useRef, useState } from 'react'
import { POSContext } from '../context/POSContext';

const MenuItem = ({ icon: Icon, label, path, toggleSideMenu, isActive, onClick, isActiveUsers, onClickUser, onClickShop, isActiveShop }) => {

    const settingsRef = useRef();
    const [toggleSeetings, setToggleSettings] = useState(false)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (settingsRef.current && !settingsRef.current.contains(e.target)) {
                setToggleSettings(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    if (label === "Settings") {
        return (<div>
            <div ref={settingsRef} className=" ">
                <div
                    onClick={() => setToggleSettings(!toggleSeetings)}

                    className={` ${isActiveShop && "border-r-[4px] border-r-black bg-gray-200"} ${isActiveUsers && "border-r-[4px] border-r-black bg-gray-200"} flex cursor-pointer items-center justify-between  px-4 py-4 text-gray-700 hover:bg-gray-200 hover:text-gray-700`}
                >
                    <div className={`${!toggleSideMenu && "group relative"} flex gap-5 items-center`}>

                        <div className="text-gray-500">
                            <Icon size={20} />
                        </div>
                        <div className={`${toggleSideMenu ? "hidden lg:flex" : "text-[0px]"} text-sm font-medium`}> Settings </div>

                        {!toggleSideMenu &&
                            <span className="invisible left-7 absolute start-full top-[48%] ms-2 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                                {label}
                            </span>
                        }
                        {toggleSideMenu && <span className={`${toggleSeetings && "rotate-180"} shrink-0 transition duration-300 `}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-5 hidden lg:flex "
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>}
                    </div>

                </div>

                {toggleSeetings && <div className={`${toggleSideMenu ? 'lg:w-auto w-full  lg:flex sm:flex-col lg:items-stretch ' : 'w-full  flex flex-col '} text-xs sm:text-sm items-baseline space-y-2 lg:px-4 text-start sm:text-center lg:ml-5  mt-2`}>
                    <div className=''>
                        <div
                            onClick={onClickShop}
                            className={`${toggleSideMenu ? '' : 'lg:shadow'} ${isActiveShop ? ' bg-gray-100 text-gray-700' : 'bg-white text-gray-500'}  border border-gray-100 block rounded-lg px-4 cursor-pointer py-2 font-medium   hover:bg-gray-100 hover:text-gray-700`}
                        >
                            Shop
                        </div>
                    </div>

                    <div>
                        <div
                            onClick={onClickUser}
                            className={`${toggleSideMenu ? '' : 'lg:shadow'} ${isActiveUsers ? ' bg-gray-100 text-gray-700' : 'bg-white text-gray-500'}  border border-gray-100 block rounded-lg px-4 cursor-pointer py-2 font-medium   hover:bg-gray-100 hover:text-gray-700`}
                        >
                            Users
                        </div>
                    </div>
                </div>}
            </div>
        </div>
        )
    }
    return (
        <div
            className={`${isActive && "border-r-[4px] border-r-black bg-gray-200"
                } relative px-4 py-4 cursor-pointer font-sans font-medium text-gray-700 hover:bg-gray-200`}
            onClick={onClick}
        >
            <div className={`flex gap-5 ${!toggleSideMenu && "group relative"} items-center`}>
                <div className="text-gray-500">
                    <Icon size={20} />
                </div>
                <div className={`${toggleSideMenu ? "hidden lg:flex" : "text-[0px]"} text-sm tracking-wide ease-in-out duration-300`}>
                    {label}
                </div>

                <span className="invisible absolute start-full top-[48%] ms-2 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                    {label}
                </span>

            </div>
        </div>
    )
}

export default MenuItem