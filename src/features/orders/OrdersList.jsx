
import { useGetOrdersQuery } from "./ordersApiSlice";
import Order from "./Order";
import Thead from "../../components/Thead";
import Tbody from "../../components/Tbody";
import { useCallback, useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";
import ReceiptModal from "../../components/ReceiptModal"
import { MdErrorOutline, MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { ImFilesEmpty } from "react-icons/im";


const OrdersList = () => {


  const [search, setsearch] = useState("");
  const columnsArray = ["ORDER#/TYPE", "DATE/TIME", "NO. OF ITEMS", "TOTAL", "BARISTA"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderId, setOderID] = useState('');
  const [backDateOrder, setBackDateOrder] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState([]);

  const handleModalOpen = (id, isBackDate) => {
    setOderID(id)
    setBackDateOrder(isBackDate)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }


  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrdersQuery("ordersList", {
    pollingInterval: 10000, // refresh data every 10 seconds
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  // Reset to the first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const updateVisiblePages = useCallback(() => {
    if (!isSuccess) return; // Only update if data is successfully fetched

    const { ids, entities: ordersEntities } = orders;

    // **Filtering Orders Based on Search**
    const filteredOrders = ids.filter((id) => {
      const order = ordersEntities[id];
      return (
        order?.orderNo.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        order?.type?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        order?.dateTime?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        order?.barista?.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
    });

    const totalPages = Math.ceil(filteredOrders.length / 7);
    let pages = [];

    if (totalPages <= 5) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }

    setVisiblePages(pages);
  }, [search, orders, isSuccess, currentPage]); // Add currentPage as a dependency


  // Use useEffect to update visible pages whenever dependencies change
  useEffect(() => {
    updateVisiblePages();
  }, [updateVisiblePages]);

  let content;


  if (isLoading) {
    content = <PageLoader />

  } else if (isError) {
    content = (
      <div className="no-print mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="sm:flex justify-between">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold  text-gray-500 ">
              Order List
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
                  className="w-full pl-10 p-2 block py-4 px-6 text-sm font-normal bg-white text-gray-900 border border-gray-200 outline-none focus:border-gray-300  focus:shadow-sm rounded-xl"
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

  } else if (isSuccess) {

    const { ids, entities: ordersEntities } = orders;

    // **Filtering Orders Based on Search**
    const filteredOrders = ids.filter((id) => {
      const order = ordersEntities[id];
      return (
        order?.orderNo.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        order?.type?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        order?.dateTime?.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
        order?.barista?.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
    });



    const totalPages = Math.ceil(filteredOrders.length / 7);

    const currentData = filteredOrders.slice(
      (currentPage - 1) * 7,
      currentPage * 7
    );

    const tableContent = currentData?.length && currentData.map((orderId) => <Order key={orderId} orderId={orderId} handleModalOpen={handleModalOpen} />)
    const checkOrders = Object.values(ordersEntities).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))



    const handlePrevPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const goToPage = (page) => {
      setCurrentPage(page);
    };

    const handlePageClick = (page) => {
      if (page === "...") return;
      goToPage(page);
    };

    content = (
      <>
        <ReceiptModal isOpen={isModalOpen} onClose={handleModalClose} orderId={orderId} backDateOrder={backDateOrder} />

        <div className="no-print mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="sm:flex justify-between">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold  text-gray-500 ">
                Order List
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
                    className="w-full pl-10 p-2 block py-4 px-6 text-sm font-normal bg-white text-gray-900 border border-gray-200 outline-none focus:border-gray-300  focus:shadow-sm rounded-xl"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setsearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-5">
            <div className="h-[400px] 2xl:h-[500px] min-w-full rounded bg-white col-span-1 lg:col-span-2">
              <div className="h-1 sm:h-5 bg-white mt-5 rounded-t-lg"></div>
              <div className="overflow-x-auto h-full bg-white min-w-full">
                <table className="min-w-full  divide-y divide-gray-200 text-sm leading-normal">
                  <thead className="bg-gray-50 ">
                    <tr className="sticky top-0 z-10">
                      {columnsArray.map((column, index) => (
                        <Thead thName={column} key={index} />
                      ))}
                    </tr>
                  </thead>
                  {checkOrders.length !== 0
                    && <Tbody tbName={tableContent} />
                  }
                </table>
                {checkOrders.length === 0
                  && <div className="flex text-sm flex-col p-5 gap-3 text-gray-400">
                    <div className="flex flex-col  m-auto ">
                      <div className="m-auto">
                        <ImFilesEmpty size={30} />
                      </div>
                    </div>
                    <div className='m-auto '>No orders</div>
                  </div>
                }
              </div>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-0 justify-between items-center text-sm p-4 border-t border-gray-200 bg-gray-50 rounded-b">
                {/* Showing X to Y of Z entries */}
                <div className=" text-gray-500">
                  Showing {Math.min((currentPage - 1) * 7 + 1, filteredOrders.length)} to{" "}
                  {Math.min(currentPage * 7, filteredOrders.length)} of {filteredOrders.length} entries
                </div>


                {/* Pagination controls */}
                <div className="flex justify-between items-center sm:gap-4">
                  {/* Previous Button */}
                  <button
                    className={`flex  items-center px-2 py-1 mr-2 sm:mr-0 bg-gray-50 hover:bg-gray-200 text-gray-500 rounded ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    title="Previous page"
                  >
                    <MdOutlineKeyboardArrowLeft size={20} /> <p className="hidden sm:flex">prev</p>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex">
                    {visiblePages.map((page, idx) => (
                      <button
                        key={idx}
                        className={`px-2 py-1 rounded cursor-pointer ${currentPage === page
                          ? "bg-gray-700 text-white"
                          : " hover:bg-gray-200 text-gray-700 "
                          } ${page === "..." ? "cursor-default" : ""}`}
                        onClick={() => handlePageClick(page)}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    className={`flex items-center px-2 py-1 ml-2 sm:ml-0 bg-gray-50 hover:bg-gray-200 text-gray-500 rounded ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                      }`}
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                  >

                    <p className="hidden sm:flex">next</p> <MdOutlineKeyboardArrowRight size={20} />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>


      </>
    );
  }

  return content;
};
export default OrdersList;
