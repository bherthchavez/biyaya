import { useContext, useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import iconItem from "../../assets/icon-item.svg"
import { useAddNewOrderMutation } from "../orders/ordersApiSlice";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useUpdateItemMutation } from "../items/itemsApiSlice";
import Spenner from "../../components/Spinner";
import useActivityLogger from "../../hooks/useActivityLogger";
import { POSContext } from "../../context/POSContext";
import useGenerateORDATE from "../../hooks/useGenerateORDATE";
import { IoIosArrowForward } from "react-icons/io";


export const Cart = () => {

    const { orderTransac, setOrderTransac,
        toggleCart, setToggleCart,
        enableSaveOrder, setEnableSaveOrder,
        placeOrder, setPlaceOrder
    } = useContext(POSContext);

    const { log } = useActivityLogger();

    const cashRef = useRef(null);
    const { generateDate, generateOR, formatCurrency } = useGenerateORDATE()

    const { id, name } = useAuth(); //current user id
    const [itemToBeUpdate, setItemToBeUpdate] = useState([]);

    useEffect(() => {
        orderTransac.items.length && cashRef.current ? cashRef.current.focus() : window.focus()
    }, [placeOrder]);


    // Utility to combine states
    const combineMutationStates = (...mutations) => {
        return {
            isLoading: mutations.some(({ isLoading }) => isLoading),
            isSuccess: mutations.every(({ isSuccess }) => isSuccess),
            isError: mutations.some(({ isError }) => isError),
            error: mutations.reduce((acc, { error }) => acc || error, null),
        };
    };

    // Use mutations
    const [addNewOrder, addNewOrderState] = useAddNewOrderMutation();
    const [updateItem, updateItemState] = useUpdateItemMutation();

    // Combined states
    const { isLoading, isSuccess, isError, error } = combineMutationStates(addNewOrderState, updateItemState);

    // Use `isLoading`, `isSuccess`, `isError`, and `error` as needed when saving the order and updating the items


    const inputChange = (e) => {
        setOrderTransac({ ...orderTransac, cash: Number(e.target.value), change: Number(e.target.value) - orderTransac.total })
        Number(e.target.value) >= orderTransac.total ? setEnableSaveOrder(true) : setEnableSaveOrder(false)

    }

    useEffect(() => {
        if (orderTransac?.items) {
            const updatedItems = orderTransac.items
                .filter(data => data?.stock)  // Filter out items without stock
                .map(data => ({
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    stockMGT: data.stock,
                    category: data.category,
                    price: data.price,
                    qty: data.currentStock - data.qty,
                    status: data.currentStock - data.qty === 0 ? 'Out of Stock' : 'In Stock',
                }));

            setItemToBeUpdate(updatedItems);
        }
    }, [orderTransac]);


    const computeTotal = () => {
        if (orderTransac.items.length) {
            setPlaceOrder(prev => !prev)
            setEnableSaveOrder(prev => !prev)   // Enable save order button
        }
    }


    const saveOrder = async () => {

        if (!enableSaveOrder) return;
        try {
            const result = await addNewOrder(orderTransac);

            if (result?.data?.message) {
                handleSuccess(result.data.message);
                log(`POS ORDER`, `Order No. ${orderTransac?.orderNo} Grand Total: ${orderTransac?.total}`, result?.data?.orderTransaction)


                if (itemToBeUpdate.length) {
                    // Update each item after the order is successfully saved
                    const updatePromises = itemToBeUpdate.map(item => updateItem({ ...item }));

                    // Wait for all updateItem mutations to complete
                    const updateResults = await Promise.allSettled(updatePromises);

                    // Handle the results of the item updates
                    handleUpdateResults(updateResults);
                }
            }
        } catch (error) {
            handleError(error);
        }
    };

    const handleUpdateResults = (results) => {
        const hasErrors = results.some(result => result.status === 'rejected');

        if (hasErrors) {
            toast.error("Some items failed to update.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        } else {
            toast.success("All items updated successfully.", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            resetOrderState();
        }
    };

    const handleSuccess = (message) => {
        toast.success(message, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
        resetOrderState();
    };

    // Helper function to handle error
    const handleError = (error) => {
        toast.error(error?.error?.error || "An unexpected error occurred", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    };

    // Helper function to reset order state
    const resetOrderState = () => {
        setToggleCart(false);
        setPlaceOrder(false);
        setEnableSaveOrder(false);
        setOrderTransac({
            user: id,
            orderNo: generateOR(),
            dateTime: generateDate(),
            barista: name,
            orderType: 'Dine in',
            items: [],
            total: 0,
            cash: 0,
            change: 0
        });
    };



    const updateItems = (id, option) => {
        const index = orderTransac.items.findIndex(item => item.id === id);
        if (index === -1) return; // Exit if item not found

        const tempRows = [...orderTransac.items]; // Avoid direct state mutation
        const tempObj = { ...tempRows[index] }; // Copy state object at index to a temporary object

        if (tempObj.qty >= 1) {

            if (option) {
                // Increment qty if stock management allows it
                if ((tempObj?.stock && tempObj?.currentStock > tempObj?.qty) || !tempObj?.stock) {
                    tempObj.qty = tempObj.qty + 1;
                }
            } else {
                // Decrement qty
                tempObj.qty = tempObj.qty - 1;
            }

            tempObj.total = tempObj.qty * tempObj.price;

            // Remove item if quantity is zero
            if (tempObj.qty === 0) {
                tempRows.splice(index, 1);
            } else {
                tempRows[index] = tempObj; // Update item in the array
            }
        }

        // Calculate new total
        const newTotal = tempRows.reduce((totalOrder, item) => totalOrder + item.total, 0);

        // Set the updated state
        setOrderTransac({
            ...orderTransac,
            items: tempRows,
            total: newTotal,
            cash: newTotal,
            change: 0
        });

        setPlaceOrder(false);
        setEnableSaveOrder(false);

    };

    const totalQty = orderTransac?.items.reduce((sum, item) => sum + Number(item.qty), 0)


    const classToggleCart = toggleCart ? ' right-0' : ' right-[-100%]'

    const content = (
        <>
            <div className={`${classToggleCart} flex shadow-2xl sm:shadow-transparent h-full fixed w-80 ease-in-out duration-300 z-40 px-5 top-0 bottom-0 flex-col justify-between border-e bg-white `}>
                <div className={`py-5 flex flex-col relative gap-5`}>

                    <div
                        onClick={() => setToggleCart(false)}
                        title="Hide Cart"
                        className="flex my-auto text-gray-700 p-1 absolute -right-2 top-5 hover:shadow cursor-pointer rounded-full">
                        <IoIosArrowForward size={26} />
                    </div>

                    <div className="flex items-center  gap-4">
                        <h1 className={`text-2xl lg:text-3xl text-gray-700`}

                        >
                            Cart
                        </h1>
                        <p className="flex text-base text-gray-300 font-light">
                            {orderTransac.orderNo}
                        </p>
                    </div>
                    <div className="flex gap-5 text-xs items-center">
                        <button
                            title="Dine in"
                            onClick={() => setOrderTransac({ ...orderTransac, orderType: 'Dine in' })}
                            className={`${orderTransac.orderType == 'Dine in' ? 'bg-[#242424] text-white' : 'text-black'} flex px-5 hover:shadow py-2 border border-gray-300 rounded-full`} >
                            Dine in {orderTransac?.items.length !== 0 && orderTransac.orderType == 'Dine in' && `(${totalQty})`}
                        </button>
                        <button
                            title="Dine in"
                            onClick={() => setOrderTransac({ ...orderTransac, orderType: 'Take out' })}
                            className={`${orderTransac.orderType === 'Take out' ? 'bg-[#242424] text-white' : 'text-black'} flex px-5 hover:shadow py-2 border border-gray-300 rounded-full`} >
                            Take out {orderTransac?.items.length !== 0 && orderTransac.orderType == 'Take out' && `(${totalQty})`}
                        </button>
                    </div>

                </div>

                <div className="h-2/3 overflow-x-auto bg-gray-50 px-4 rounded-md">
                    {orderTransac.items.length
                        ? orderTransac.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3  border-b py-5 border-gray-300 text-center text-gray-800 hover:text-gray-500">
                                <div className="text-4xl  font-bold  md:text-5xl   flex flex-col gap-2">
                                    <div className='h-20 w-16 object-cover bg-gray-600 rounded-2xl'>
                                        <img
                                            alt="Man"
                                            src={item.avatar
                                                ? item.avatar
                                                : iconItem
                                            }
                                            className="h-20 w-16 rounded-2xl opacity-60 object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="w-full px-2 text-sm flex flex-col gap-2 items-start justify-start text-gray-500">
                                    <div className='text-gray-800 text-base text-left'>
                                        <h1 className='font-semibold'>{item.name}
                                        </h1>
                                        <h1 className='text-gray-500 text-sm font-semibold'> {formatCurrency(item.price)}</h1>
                                        {item.stock && <h1 className='text-green-700 text-xs mt-1'> {Number(item.currentStock)} in stock</h1>}
                                    </div>
                                    <div className="flex justify-center items-center">
                                        <div className=''>
                                            <label htmlFor="Quantity" className="sr-only"> Quantity </label>

                                            <div className="flex items-center">
                                                <span
                                                    onClick={() => updateItems(item.id, false)}
                                                    className="cursor-pointer border border-gray-300 hover:bg-gray-100 rounded-full  p-3 text-black transition hover:opacity-75">
                                                    <FaMinus size={8} />

                                                </span>

                                                <input
                                                    type="number"
                                                    id="Quantity"
                                                    value={item.qty}
                                                    readOnly
                                                    className="h-10 w-9 font-bold rounded bg-transparent border-gray-200 text-center sm:text-sm text-black [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none "
                                                />

                                                <span
                                                    onClick={() => updateItems(item.id, true)}
                                                    className="cursor-pointer border border-gray-300 hover:bg-gray-100 rounded-full p-3 text-black transition hover:opacity-75">
                                                    <FaPlus size={8} />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                        : <>
                            <div className="flex flex-col justify-center items-center gap-2 mt-10">
                                <h1 className="text-xl lg:text-2xl font-semibold text-gray-300">No Items</h1>
                                <p className="text-xs text-gray-300">Add items to cart to compute the total. </p>
                            </div>

                        </>



                    }

                </div>

                <div className={`py-4 bg-white  font-sans sticky bottom-0`}>
                    <div className={`flex flex-col gap-2 lg:gap-5`}>
                        <div className="flex justify-between text-xl lg:text-2xl font-medium">
                            <h1 className="text-gray-500">Total</h1>
                            <p className="text-green-800"> {formatCurrency(orderTransac.total)}</p>
                        </div>
                        {placeOrder
                            ?
                            <>
                                <div className="flex items-center justify-between text-xl lg:text-2xl font-medium">
                                    <h1 className="text-gray-500">Cash</h1>
                                    <input
                                        className={`w-2/3 mt-1 px-3 py-1 text-right font-semibold text-gray-900 border border-gray-300 outline-none focus:border-gray-300 focus:shadow-sm rounded-md`}
                                        id="cash"
                                        name="cash"
                                        type="number"
                                        ref={cashRef}
                                        required
                                        value={orderTransac.cash}
                                        onChange={inputChange}
                                    />
                                </div>
                                <div className="flex justify-between text-lg">
                                    <h1 className="text-gray-500">Change</h1>
                                    <p className="text-red-800 font-medium"> {formatCurrency(orderTransac.change)}</p>
                                </div>
                                <span
                                    onClick={saveOrder}
                                    title="Save Order"
                                    disabled={enableSaveOrder}
                                    className={`${enableSaveOrder ? 'bg-green-900 hover:bg-green-700 ' : 'bg-gray-300'}  cursor-pointer flex font-medium text-lg lg:text-xl justify-center  text-gray-100 w-full py-2 lg:py-3 border border-gray-300 rounded-full`} >

                                    {isLoading
                                        ?
                                        <div className=" text-sm flex text-gray-400 justify-end">
                                            <Spenner />
                                            <p>Saving order.... </p>
                                        </div>
                                        : `Save order`
                                    }


                                </span>
                            </>
                            :
                            <>
                                <div
                                    onClick={computeTotal}
                                    title="Place an order"
                                    className={`${orderTransac.items.length ? `bg-gray-900 hover:bg-black text-white ` : `bg-gray-300 text-white`} cursor-pointer flex  font-medium text-lg lg:text-xl justify-center w-full py-2 lg:py-3 border border-gray-300 rounded-full`} >
                                    Place an order
                                </div>

                            </>
                        }

                    </div>
                </div>

            </div>



        </>
    )

    return content
}
