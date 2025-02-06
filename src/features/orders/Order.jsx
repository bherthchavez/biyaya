import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectOrderById } from "./ordersApiSlice";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useGenerateORDATE from "../../hooks/useGenerateORDATE";

const Order = ({ orderId, search, handleModalOpen }) => {

  const { formatCurrency } = useGenerateORDATE()
  const { isAdmin } = useAuth()
  const order = useSelector((state) => selectOrderById(state, orderId));
  const [viewReceipt, setViewReceipt] = useState(false);
  const optionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionRef.current && !optionRef.current.contains(e.target)) {
        setViewReceipt(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (order) {


    if (order.orderNo.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      order.barista.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      order.dateTime.toLowerCase().indexOf(search.toLowerCase()) > -1 ||
      order.orderType.toLowerCase().indexOf(search.toLowerCase()) > -1
    ) {

      return (
        <>

          <tr className="text-base">
            <td
              className={`flex gap-2 whitespace-nowrap px-4 sm:px-7 py-3 font-medium text-gray-700`}
            >
              <div
                className="relative  text-gray-400 my-auto font-normal cursor-pointer hover:text-gray-600"
                ref={optionRef}
                onClick={() => setViewReceipt(prev => !prev)}
              >

                <BsThreeDotsVertical size={20} />
                {viewReceipt &&
                  <div className="absolute left-[-8px] z-50 origin-top-right bg-white border border-gray-200 mt-2 w-48 rounded-md shadow-lg">
                    <div className="block top-[-7px] bg-white h-3 w-3 border-t border-l border-gray-200 rotate-45 absolute left-3"></div>

                    <div className="py-2">
                      <div
                        onClick={() => handleModalOpen(order.id, false)}
                        className="cursor-pointer block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        View Receipt
                      </div>
                      {isAdmin &&
                        <div
                          className="cursor-pointer block text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100 hover:text-gray-900"
                          onClick={() => handleModalOpen(order.id, true)}
                        >

                          Back Date Order
                        </div>
                      }
                    </div>

                  </div>
                }

              </div>
              <div className="flex flex-col text-left">
                <h1 className="font-semibold text-sm">{order.orderNo} </h1>
                <p className="text-gray-600 text-sm font-normal">{order.orderType} </p>
              </div>
            </td>

            <td className={`whitespace-nowrap  px-8 py-2  text-gray-900`}>
              <p className="text-sm text-gray-700">
                {order.dateTime}
              </p>
            </td>

            <td className={`whitespace-nowrap px-8 py-2  text-gray-900`}>
              <p className="">{order.items.reduce((totalItem, item) => totalItem + Number(item.qty), 0)} </p>
            </td>
            <td className={`whitespace-nowrap px-8 py-2 font-semibold  text-gray-900`}>
              <p className="">{formatCurrency(order.total)} </p>
            </td>

            <td className={`whitespace-nowrap px-8 py-2 text-sm  text-gray-900 `}>
              {order.barista}
            </td>
          </tr>
        </>
      );
    }



  } else return null;


};
export default Order;
