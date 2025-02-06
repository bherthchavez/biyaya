
import { useGetItemsQuery } from "./itemsApiSlice";
import Item from "./Item";
import Thead from "../../components/Thead";
import Tbody from "../../components/Tbody";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PageLoader from "../../components/PageLoader";
import { IoMdAdd } from "react-icons/io";
import PageError from "../../components/PageError";
import { ImFilesEmpty } from "react-icons/im";
import { MdErrorOutline } from "react-icons/md";


const ItemsList = () => {

  const [search, setsearch] = useState("");
  const columnsArray = ["ITEM NAME", "DESCRIPTION", "Stock", "PRICE", "CATEGORY"];


  const navigate = useNavigate();
  const {
    data: items,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetItemsQuery("itemsList", {
    pollingInterval: 10000, // refresh data every 15 seconds
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;


  if (isLoading) content = <PageLoader />

  if (isError) {
    content = (
      <div className="no-print mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:flex justify-between">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold  text-gray-500 ">
              Item List
            </h1>
          </div>

          <div className="sm:flex  mt-6 sm:mt-0">
            <div className="">
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none shrink-0">
                  <svg
                    className="w-4 h-4  text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    // className="h-4 w-4"
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
                </div>
                <input
                  type="text"
                  id="table-search"
                  className="w-full pl-10 p-2 block py-4 px-6 text-sm font-normal bg-white text-gray-900 border  border-gray-200 outline-none focus:border-gray-300  focus:shadow-sm rounded-xl"
                  placeholder="Search..."
                  value={search}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 mt-5">
          <div className="h-[400px] 2xl:h-[500px] min-w-full rounded bg-white col-span-1 lg:col-span-2">
            <div className="h-5 bg-white mt-5 rounded-t-lg"></div>
            <div className="overflow-x-auto h-full bg-white min-w-full shadow-sm ">
              <table className="min-w-full  divide-y divide-gray-200 text-sm leading-normal">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="sticky">
                    {columnsArray.map((column, index) => (
                      <Thead thName={column} key={index} />
                    ))}
                  </tr>
                </thead>
              </table>
              <div className="flex text-sm flex-col p-5 gap-3 text-red-700">
                <div className="flex flex-col  m-auto ">
                  <div className="m-auto">
                    <MdErrorOutline size={30} />
                  </div>
                </div>
                <div className='m-auto'>{error?.data?.message}</div>
              </div>
            </div>
            <div className="pt-10 bg-gray-50 rounded-b"></div>
          </div>
        </div>

      </div>
    )
    //  content = <PageError error={error?.data?.message}/>
  }


  const handleSearch = (text) => {
    setsearch(text);
  };

  if (isSuccess) {
    const { ids, entities: itemsEntities } = items;
    const tableContent = ids?.length && ids.map((itemId) => <Item key={itemId} itemId={itemId} search={search} />)
    const checkItems = Object.values(itemsEntities).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    content = (
      <>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 no-print">
          <div className="sm:flex justify-between">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <h1 className="text-xl font-semibold  text-gray-500 ">
                  Item List
                </h1>
                <span className="text-gray-600">{`(${checkItems.length})`}</span>
              </div>
              <span
                onClick={() => navigate("/inventory/new")}
                title='Add Item'
                className="flex text-xs gap-2 sm:hidden items-center cursor-pointer  px-4 py-3 text-black border font-medium border-gray-300 hover:bg-gray-200 rounded-full duration-150"
              >
                <IoMdAdd size={15} /> Add Item
              </span>
            </div>

            <div className="sm:flex  mt-6 sm:mt-0">
              <div className="pr-0 sm:pr-5">
                <label htmlFor="table-search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none shrink-0">
                    <svg
                      className="w-4 h-4  text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      // className="h-4 w-4"
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
                  </div>
                  <input
                    type="text"
                    id="table-search"
                    className="w-full pl-10 p-2 block py-4 px-6 text-sm font-normal bg-white text-gray-900 border  border-gray-200  -gray-700 outline-none focus:border-gray-300  focus:shadow-sm rounded-xl"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex">
                <span
                  onClick={() => navigate("/inventory/new")}
                  title='Add New Item'
                  className="hidden sm:flex gap-3 items-center cursor-pointer  px-8 py-3 text-black border font-medium border-gray-300 hover:bg-white rounded-full duration-150"
                >
                  <IoMdAdd size={19} />
                  Add Item
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-5">
            <div className="h-[400px] 2xl:h-[500px] min-w-full rounded bg-white col-span-1 lg:col-span-2">
              <div className="h-5 bg-white mt-5 rounded-t-lg"></div>
              <div className="overflow-x-auto h-full bg-white min-w-full shadow-sm">

                <table className="min-w-full  divide-y divide-gray-200 text-sm leading-normal">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="sticky z-20">
                      {columnsArray.map((column, index) => (
                        <Thead thName={column} key={index} />
                      ))}
                    </tr>
                  </thead>
                  {checkItems.length !== 0
                    && <Tbody tbName={tableContent} />
                  }
                </table>
                {checkItems.length === 0
                  && <div className="flex text-sm flex-col p-5 gap-3 text-gray-400">
                    <div className="flex flex-col  m-auto ">
                      <div className="m-auto">
                        <ImFilesEmpty size={30} />
                      </div>
                    </div>
                    <div className='m-auto '>No items</div>
                  </div>
                }
              </div>
              <div className="pt-10 bg-gray-50 rounded-b"></div>
            </div>
          </div>
        </div>


      </>
    );
  }

  return content;
};
export default ItemsList;
