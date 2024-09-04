import { useSelector } from 'react-redux';
import { selectItemById } from '../items/itemsApiSlice';
import { FaPlus } from 'react-icons/fa';
import iconItem from "../../assets/icon-item.svg";
import { useContext } from 'react';
import { POSContext } from '../../context/POSContext';

const MenuItem = ({ itemId, search }) => {

    const { orderTransac, setOrderTransac,
        headSearch, setPlaceOrder,
        setEnableSaveOrder,
    } = useContext(POSContext);

    const item = useSelector((state) => selectItemById(state, itemId));

    const calculateTotal = (items) => {
        return items.reduce((totalOrder, item) => totalOrder + item.total, 0);
    };

    const updateItemInCart = (tempRows, index, tempObj) => {
        tempObj.qty += 1;
        tempObj.total = tempObj.qty * tempObj.price;
        tempRows[index] = tempObj;
        setOrderTransac({ ...orderTransac, items: [...orderTransac.items, tempRows] });
        setOrderTransac({ ...orderTransac, total: calculateTotal(tempRows), cash: 0, change: 0 });
    };


    const addItemToCart = () => {
        const index = orderTransac.items.findIndex(items => items.id === item.id);

        const tempRows = [...orderTransac.items]; // Avoid direct state mutation

        if (index !== -1) {
            const tempObj = { ...orderTransac.items[index] }; // Copy state object at index to a temporary object
            const canAddToCart = !tempObj.stock || tempObj.currentStock > tempObj.qty;

            if (canAddToCart) {
                updateItemInCart(tempRows, index, tempObj);
                setOrderTransac({
                    ...orderTransac,
                    items: tempRows,
                    total: orderTransac.total + tempObj.price, // Assuming you're recalculating the total
                });
            }
        } else {
            const newItem = {
                id: item.id,
                name: item.name,
                avatar: item.avatar,
                stock: item.stock_mgt,
                description: item.description,
                category: item.category,
                currentStock: item.qty,
                qty: 1,
                price: Number(item.price),
                total: Number(item.price),
            };

            setOrderTransac((prevState) => {
                const updatedItems = [...prevState.items, newItem];
                return {
                    ...prevState,
                    items: updatedItems,
                    total: prevState.total + newItem.price,
                    cash: 0,
                    change: 0
                };
            });
        }

        setPlaceOrder(false);
        setEnableSaveOrder(false);
    };



    if (item && item.status === "In Stock") {
        if (search !== 'All' && item.category === search) {

            return (
                <div className="gap-3 flex flex-col justify-between bg-white dark:bg-slate-800 rounded-3xl shadow-sm border-gray-200 dark:border-gray-800 p-2 sm:p-4 text-center text-gray-800 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400">
                    <div className="text-4xl font-bold md:text-5xl flex flex-col">
                        <div className='h-20 w-full lg:h-36 lg:w-full object-cover bg-gray-600 rounded-3xl'>
                            <img
                                alt={item.name}
                                src={item.avatar || iconItem}
                                className="h-20 w-full lg:h-36 lg:w-full rounded-3xl opacity-80 dark:border-slate-600 object-cover"
                            />
                        </div>
                        <div className="w-full text-sm font-normal mt-3 gap-4 flex flex-col items-start justify-between text-gray-500 dark:text-gray-400">
                            <div className='mx-auto text-black text-sm sm:text-lg text-center'>
                                <h1 className='font-bold'>{item.name}</h1>
                                <div className={`${item.stock_mgt ? 'sm:flex-row' : ''} flex flex-col justify-between my-1 text-xs sm:text-base`}>
                                    <p className='text-gray-500 font-semibold'>₱ {Number(item.price).toFixed(2)}</p>
                                    {item.stock_mgt && <p className='text-green-700 text-xs font-medium'>{item.qty} in stock</p>}
                                </div>
                                <p className='hidden sm:block text-left text-xs text-gray-400' title={item.description}>
                                    {item.description.length > 50 ? `${item.description.slice(0, 50)}...` : item.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-start items-center w-full'>
                        <span
                            title="Add to cart"
                            onClick={addItemToCart}
                            className="cursor-pointer w-full bg-[#363636] active:bg-white active:text-black hover:bg-gray-700 text-[11px] sm:text-base flex justify-center items-center gap-2 px-4 py-2 sm:py-3 text-white border border-gray-300 rounded-full"
                        >
                            <FaPlus size={10} />
                            Add to cart
                        </span>
                    </div>
                </div>
            );

        } else {

            if (search === 'All' && item.name.toLowerCase().indexOf(headSearch.toLowerCase()) > -1)

                return (
                    <div className="gap-3 flex flex-col justify-between bg-white dark:bg-slate-800 rounded-3xl shadow-sm border-gray-200 dark:border-gray-800 p-2 sm:p-4 text-center text-gray-800 dark:text-gray-200 hover:text-gray-500 dark:hover:text-gray-400">
                        <div className="text-4xl font-bold md:text-5xl flex flex-col">
                            <div className='h-20 w-full lg:h-36 lg:w-full object-cover bg-gray-600 rounded-3xl'>
                                <img
                                    alt={item.name}
                                    src={item.avatar || iconItem}
                                    className="h-20 w-full lg:h-36 lg:w-full rounded-3xl opacity-80 dark:border-slate-600 object-cover"
                                />
                            </div>
                            <div className="w-full text-sm font-normal mt-3 gap-4 flex flex-col items-start justify-between text-gray-500 dark:text-gray-400">
                                <div className='mx-auto text-black text-sm sm:text-lg text-center'>
                                    <h1 className='font-bold'>{item.name}</h1>
                                    <div className={`${item.stock_mgt ? 'sm:flex-row' : ''} flex flex-col justify-between my-1 text-xs sm:text-base`}>
                                        <p className='text-gray-500 font-semibold'>₱ {Number(item.price).toFixed(2)}</p>
                                        {item.stock_mgt && <p className='text-green-700 text-xs font-medium'>{item.qty} in stock</p>}
                                    </div>
                                    <p className='hidden sm:block text-left text-xs text-gray-400' title={item.description}>
                                        {item.description.length > 50 ? `${item.description.slice(0, 50)}...` : item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-start items-center w-full'>
                            <span
                                title="Add to cart"
                                onClick={addItemToCart}
                                className="cursor-pointer w-full bg-[#363636] active:bg-white active:text-black hover:bg-gray-900 text-[11px] sm:text-base flex justify-center items-center gap-2 px-4 py-2 sm:py-3 text-white border border-gray-300 rounded-full"
                            >
                                <FaPlus size={10} />
                                Add to cart
                            </span>
                        </div>
                    </div>
                );
        }
    }

    return null;
};

export default MenuItem;
