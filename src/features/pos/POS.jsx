import React, { useContext, useEffect, useState } from 'react'
import { useGetItemsQuery } from '../items/itemsApiSlice';
import PageLoader from "../../components/PageLoader";
import MenuItem from './MenuItem';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineShoppingCart } from 'react-icons/md';
import PageError from '../../components/PageError';
import { POSContext } from '../../context/POSContext';
import { ToastContainer } from 'react-toastify';
import { IoIosArrowForward } from 'react-icons/io';

const POS = () => {

    const { headSearch, setHeadSearch,
        orderTransac, toggleCart, setToggleCart,
    } = useContext(POSContext);

    const [search, setsearch] = useState("All");

    const itemCategories = ["All", "Coffee", "Non Coffee", "Food", "Other"]

    const {
        data: items,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetItemsQuery("itemsList", {
        pollingInterval: 15000, // refresh data every 15 seconds
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        headSearch && setsearch('All')

    }, [headSearch])

    const onCategorySearch = (category) => {
        setsearch(category)
        setHeadSearch('')
    }


    let content;


    if (isLoading) content = <PageLoader />

    if (isError) {
        content = <PageError error={error?.data?.message} />
    }



    if (isSuccess) {
        const { ids } = items;

        const menuContent = ids?.length && ids.map((itemId) => <MenuItem key={itemId} itemId={itemId} search={search} />)

        content = (
            <>
                <div aria-label="Page Header" className='mb-20 no-print'>
                    <aside
                        onClick={() => setToggleCart(true)}
                        className={`fixed bottom-5 end-5 hover:p-7 ease-in-out duration-300  z-30 flex items-center justify-center  rounded-full bg-white p-5  cursor-pointer border border-gray-200 shadow-2xl`}
                    >
                        <div className='relative text-black '>
                            {orderTransac?.items?.length !== 0 &&
                                <div className='absolute flex rounded-full w-full h-full bg-red-600 -top-6 -right-5 z-10'>
                                    <h1 className='flex mx-auto items-center p-1 text-white text-xs text-center font-bold'>
                                        {orderTransac.items?.reduce((total, item) => total + item.qty, 0)}
                                    </h1>
                                </div>
                            }
                           
                            <MdOutlineShoppingCart size={25} />
                        </div>

                    </aside>

                    <div className='z-20 sticky  top-[79px] lg:top-32  bg-white sm:bg-[#f1f1f1] border-b border-gray-200'>
                        <div className='flex flex-col px-6 lg:px-12 pt-5 pb-2'>
                            <div className='flex justify-between gap-2 items-center'>
                                <h1 className="text-md font-medium  text-gray-700 md:text-xl lg:text-2xl">
                                    {search ? search : 'All'} Menu
                                </h1>
                                <div className="relative block">
                                    <label className="sr-only" htmlFor="search">
                                        {" "}
                                        Search{" "}
                                    </label>
                                    <button
                                        type="button"
                                        className="absolute top-1/2 left-1 -translate-y-1/2 rounded-full p-2 text-gray-400 transition hover:text-gray-700"
                                    >
                                        <span className="sr-only">Submit Search</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                    </button>
                                    <input
                                        className="h-10 w-32 border border-gray-100 rounded-full bg-[#f1f1f1]  sm:bg-white pl-11 pr-2 text-sm md:w-48 lg:w-56"
                                        id="search"
                                        type="search"
                                        placeholder="Search..."
                                        value={headSearch}
                                        onChange={(e) => setHeadSearch(e.target.value)}
                                    />
                                </div>

                            </div>

                            <div className='grid grid-cols-1 min-w-full'>
                                <div className='flex whitespace-nowrap overflow-y-auto py-3 gap-3 text-xs lg:text-lg'>
                                    {itemCategories.map((category, idx) => (
                                        <div
                                            key={idx}
                                            title={category}
                                            onClick={() => onCategorySearch(category)}
                                            className={`${search === category ? 'bg-[#242424] text-white active:bg-black' : 'active:bg-white text-black hover:shadow'} flex justify-center items-center px-6 sm:px-8 py-2 cursor-pointer  border border-gray-300 rounded-full`} >
                                            {category}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto max-w-screen-xl mt-4 lg:mt-6 px-8 lg:px-10">
                        <div className="font-normal grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4  ">
                            {menuContent}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return content
}

export default POS