import React, { useEffect, useRef, useState } from 'react'
import Spinner from './Spinner';
import { ImFilesEmpty } from 'react-icons/im';
import useGenerateORDATE from "../hooks/useGenerateORDATE";


const RecentOrders = ({ orders, handleModalOpen, columnsOrders }) => {

  const [visibleOrders, setVisibleOrders] = useState(6);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const { formatCurrency } = useGenerateORDATE()


  const loadMoreOrders = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      // Increment exactly 4 logs on each load, ensuring we don't load more than the total number of logs
      setVisibleOrders(prev => {
        const remainingOrders = orders.length - prev;
        const increment = remainingOrders >= 4 ? 4 : remainingOrders; // Load exactly 4 or the remaining logs
        return prev + increment;
      });
      setLoading(false);
    }, 1000); // Simulate a loading delay of 1 second
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;

      if (isBottom && visibleOrders < orders.length) {
        loadMoreOrders();
      }
    }
  };

  

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [visibleOrders, orders.length]);

  return (
    <div className=" h-96 min-w-full rounded bg-white col-span-1 lg:col-span-2">
      <h1 className="py-4 px-6 text-sm font-medium text-gray-700 ">Orders</h1>
      <div ref={containerRef} className="overflow-x-auto h-full bg-white min-w-full shadow-sm ">

        <table className="min-w-full  divide-y divide-gray-200 text-sm leading-normal">
          <thead className="bg-gray-50 sticky top-0">
            <tr className="sticky">
              {columnsOrders.map((column, index) => (
                <th key={index} className={`mx-auto text-start px-6 py-2 bg-[#F1F1F1] text-xs font-normal text-gray-500 uppercase tracking-wider`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 ">
            {orders.length !== 0
              && orders.slice(0, visibleOrders).map((order, idx) => (
                <tr key={idx} onClick={(() => handleModalOpen(order.id))} className="hover:bg-gray-100 cursor-pointer ">

                  <td
                    className={`sm:flex gap-4 whitespace-nowrap px-6 py-3 font-medium text-gray-900`}
                  >
                    <div className="flex flex-col text-left">
                      <h1 className="font-medium">{order.orderNo} </h1>
                      <p className="text-gray-600  font-normal">{order.orderType} </p>
                    </div>
                  </td>

                  <td className={`whitespace-nowrap  px-6 py-3  text-gray-900`}>
                    <p className=" text-gray-700">
                      {order.dateTime}
                    </p>
                  </td>

                  <td className={`whitespace-nowrap px-6 py-3  text-gray-900`}>
                    <p className="">{order.items.reduce((totalItem, item) => totalItem + Number(item.qty), 0)} </p>
                  </td>
                  <td className={`whitespace-nowrap px-6 py-3 font-semibold  text-gray-900`}>
                    <p className="">{formatCurrency(order.total)} </p>
                  </td>

                  <td className={`whitespace-nowrap px-6 py-3 text-gray-900 `}>
                    {order.barista}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {orders.length === 0
          && <div className="flex text-sm flex-col p-5 gap-3 text-gray-400">
            <div className="flex flex-col  m-auto ">
              <div className="m-auto">
                <ImFilesEmpty size={30} />
              </div>
            </div>
            <div className='m-auto '>No recent orders</div>
          </div>
        }
        {loading && (
        <div className="flex py-4 justify-center">
          <Spinner />
        </div>
      )}
      </div>
     
      <div className="pt-8 bg-gray-50 rounded-b"></div>
    </div>
  )
}

export default RecentOrders