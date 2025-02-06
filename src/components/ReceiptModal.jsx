import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosClose } from 'react-icons/io';
import { useSelector } from "react-redux";
import { selectOrderById, useUpdateOrderMutation } from "../features/orders/ordersApiSlice";
import { BsThreeDotsVertical } from "react-icons/bs";
import biyayaLogo from "../assets/biyaya_logo.png";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
import useActivityLogger from "../hooks/useActivityLogger";
import useGenerateORDATE from "../hooks/useGenerateORDATE";

function Modal({ isOpen, onClose, orderId, backDateOrder }) {

  const { formatCurrency } = useGenerateORDATE()
  const { log } = useActivityLogger();
  const [printNav, setPrintNav] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const order = useSelector((state) => selectOrderById(state, orderId));
  const optionRef = useRef();
  const printRef = useRef();


  const [selectedDate, setSelectedDate] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const [updateOrder] = useUpdateOrderMutation();

  const options = {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };


  const formatter = new Intl.DateTimeFormat('en-GB', options);

  const formatDateToParts = (date) => {
    const parts = formatter.formatToParts(date);
    const lookup = Object.fromEntries(parts.map(p => [p.type, p.value]));

    return `${lookup.year}-${lookup.month}-${lookup.day}T${lookup.hour}:${lookup.minute}`;
  };

  useEffect(() => {
    // Format the current date
    const now = new Date();
    const formattedNow = formatDateToParts(now);
    setMaxDate(formattedNow);

    // Format the order date if it exists
    if (order) {
      const orderDate = new Date(order?.dateTime.replace(' at ', ', ')); // Ensure it's a Date object
      const formattedOrderDate = formatDateToParts(orderDate);
      setCurrentDate(formattedOrderDate);
    }

  }, [order]);

  const handleDateChange = (event) => {
    const now = new Date()
    const inputDate = new Date(event.target.value);
    const currentDateNow = formatDateToParts(now)
    const inputDateParts = formatDateToParts(new Date(event.target.value))
    setCurrentDate(formatDateToParts(inputDate));

    if (inputDateParts <= currentDateNow) {
      setSelectedDate(inputDate);

    } else {
      console.warn("Selected date and time is in the future!");
      setSelectedDate("")
    }
  };


  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      timeZone: 'Asia/Manila',
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionRef.current && !optionRef.current.contains(e.target)) {
        setPrintNav(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleDownloadPDF = () => {
    const element = printRef.current;

    // Define custom options
    const opt = {
      margin: 1,
      filename: `Biyaya_Receipt-${order?.orderNo}.pdf`,
      image: { type: 'jpeg', quality: 0.99 },
      html2canvas: { scale: 5 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Generate and download the PDF with the options
    html2pdf().set(opt).from(element).save();
  };

  const onUpdateOrder = async () => {

    if (selectedDate) {
      try {
        const result = await updateOrder({
          id: orderId,
          date: formatDate(selectedDate)
        })
        toast.success(result.data, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        onClose()
        setSelectedDate("")
        log(`BACK DATE ORDER`, `Order No. ${order?.orderNo} Back Date: ${formatDate(selectedDate)}`)


      } catch (error) {
        console.error('Failed to update order', error);
      }
    }

  }

  const totalItem = order?.items.reduce((sum, item) => sum + Number(item.qty), 0);


  const showHideClassName = isOpen ? "block" : "hidden";

  return (
    <div className={`fixed z-50 inset-0 overflow-y-auto ${showHideClassName}`}>
      <div className="flex items-center justify-center  pt-4 px-4 pb-20 text-center  ">

        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-black opacity-80"></div>
        </div>

        <div
          className="inline-block bg-white rounded-xl text-center overflow-hidden  transform transition-all  sm:my-8 align-middle  w-full sm:w-8/12 lg:w-4/12"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >

          <div className="flex justify-between border-b-2 border-gray-200  no-print">
            {backDateOrder
              ? <div className="flex py-2 px-4 items-center ">
                <h1 className=" text-gray-700 text-lg uppercase font-medium">Back Date Order</h1>
              </div>
              : <div className="flex py-2 px-4 items-center ">
                <h1 className=" text-gray-700 text-lg uppercase font-medium">Receipt</h1>
                <div
                  className="relative text-gray-400 p-1 cursor-pointer hover:text-gray-600"
                  ref={optionRef}
                  onClick={() => setPrintNav(prev => !prev)}
                >

                  <BsThreeDotsVertical />
                  {printNav &&
                    <div className="absolute left-[-6px] z-50 origin-top-right bg-white border border-gray-200 mt-2 w-48 rounded-md shadow-lg">
                      <div className="block top-[-7px] bg-white h-3 w-3 border-t border-l rotate-45 absolute left-3"></div>

                      <div className="py-2">
                        <span
                          onClick={() => window.print()}
                          className="cursor-pointer block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          Print                       </span>
                        <span
                          onClick={handleDownloadPDF}
                          className="cursor-pointer block text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          Download as PDF
                        </span>
                      </div>

                    </div>
                  }

                </div>
              </div>
            }
            <button onClick={() => {
              onClose()
              setSelectedDate("")
            }} className=" w-12 h-12 m-0 p-1 cursor-pointer text-gray-300 hover:text-gray-600">
              <IoIosClose size={35} />
            </button>
          </div>

          {/* {children} */}
          {backDateOrder
            && <div className="flex justify-between gap-5 px-7 my-5">
              <div className="flex flex-col justify-start gap-2">
                <p className="text-xs tracking-wider text-gray-600 text-left">Date/Time.</p>
                <input
                  type="datetime-local"
                  className="border rounded-lg p-2 text-xs focus:outline-none focus:ring focus:border-blue-300"
                  onChange={handleDateChange}
                  max={maxDate} // Set max attribute to the current date and time
                  value={currentDate}
                />
                <p className={`${selectedDate ? 'text-black' : 'text-red-700'} text-xs`}>
                  {selectedDate ? formatDate(selectedDate) : "Please select a back date and time."}
                </p>
              </div>
              <div className="flex my-auto">
                <button
                  type="button"
                  className="rounded-full text-gray-200 bg-black hover:bg-gray-800 px-4 py-2 text-xs tracking-widest font-medium  sm:w-24"
                  onClick={onUpdateOrder}
                >
                  UPDATE
                </button>
              </div>
            </div>}

          <div ref={printRef} id="print-area" className="bg-white py-10 px-7">
            <div className={`${backDateOrder ? showItems ? 'h-auto' : 'h-20' : 'h-auto'} flex flex-col justify-between gap-7 transition-all ease-in-out duration-300`}>

              <div className="flex flex-col gap-5 border-dashed border-gray-500 border-b pb-5">
                <div className="flex justify-between pb-5 items-center text-left border-dashed border-b border-gray-500">
              
                  <div className="flex items-center gap-3 text-gray-500">
                    {!backDateOrder && <img src={biyayaLogo} alt="Logo" className="w-20 " />}
                    <div className="font-normal text-xs">
                      <div className="mb-2">
                        <p className="text-[10px] tracking-wider">ORDER NO.</p>
                        <h2 className="text-black ">{order?.orderNo}</h2>
                      </div>
                      <div className="text-gray-500">
                        <p className="text-[10px] tracking-wider">BARISTA</p>
                        <h2 className="text-black ">{order?.barista}</h2>
                      </div>

                    </div>
                  </div>


                  <div className="text-right w-24 text-xs text-gray-500">
                    <div className="mb-2">
                      <p className="text-[10px] tracking-wider">DATE/TIME</p>

                      <h2 className="text-black ">{order?.dateTime}</h2>
                    </div>
                    <div className="text-gray-500">
                      <p className="text-[10px] tracking-wider">ORDER TYPE</p>
                      <h2 className="text-black ">{order?.orderType}</h2>
                    </div>
                  </div>
                  {backDateOrder && <div onClick={() => setShowItems(prev => !prev)} className="text-xs  py-2 px-4 mt-3 rounded-full cursor-pointer text-gray-700 hover:shadow bg-slate-200 w-24 flex items-center gap-2 justify-center">
                    <span className={`${showItems ? 'rotate-180' : 'rotate-0'} ease-in-out duration-300`}><IoIosArrowDown /></span>
                    Item(s)
                  </div>}
                
                </div>

                <div className="flex  flex-col justify-between gap-2">
                  <dl className=" divide-gray-100 text-xs mb-5">
                    <div className="grid  gap-1 grid-cols-4 sm:gap-4 text-right text-gray-700">
                      <dt className=" text-gray-900 text-left ">Name</dt>
                      <dd>Qty</dd>
                      <dd>Price</dd>
                      <dd>Sub Total</dd>
                    </div>
                  </dl>
                  {order && order.items.map((item, idx) =>
                    <dl key={idx} className=" divide-gray-100 text-sm">
                      <div className="grid gap-1 grid-cols-4 text-right sm:gap-4 text-gray-700">
                        <dt className="font-medium text-gray-900 text-left">{item.name}</dt>
                        <dd>{item.qty}</dd>
                        <dd> {formatCurrency(item.price)}</dd>
                        <dd className="font-medium "> {formatCurrency(item.total)}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              </div>

              <div className="">
                <div className=" text-left text-base flex flex-col gap-2  ">
                  <div className="flex text-lg justify-between font-semibold mb-2">
                    <h1 className="text-gray-500 text-base">Item(s)</h1>
                    <h1 className="  text-gray-600 ">{totalItem}</h1>
                  </div>
                  <div className="flex justify-between">
                    <h1 className="font-bold text-lg text-gray-800">Grand Total</h1>
                    <h1 className="font-bold text-lg text-gray-800 ">{formatCurrency(order?.total)}</h1>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <h1 className=" text-gray-500 ">Cash</h1>
                    <h1 className=" text-gray-600 "> {formatCurrency(order?.cash)}</h1>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <h1 className=" text-gray-500 ">Change</h1>
                    <h1 className=" text-gray-600 "> {formatCurrency(order?.change)}</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
