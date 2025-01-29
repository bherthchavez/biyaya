import { useState } from "react";
import * as XLSX from "xlsx";
import { useGetOrdersQuery } from "../orders/ordersApiSlice";
import {
    XAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    YAxis,
} from "recharts";
import PageLoader from "../../components/PageLoader";
import PageError from "../../components/PageError";
import useGenerateORDATE from "../../hooks/useGenerateORDATE";
import { IoMdAdd } from "react-icons/io";

const Reports = () => {
    const { formatCurrency } = useGenerateORDATE();

    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [dateFilter, setDateFilter] = useState("all");
    const [customFromDate, setCustomFromDate] = useState("");
    const [customToDate, setCustomToDate] = useState("");
    const [monthFilter, setMonthFilter] = useState("all");
    const currentYear = new Date().getFullYear();

    const {
        data: ordersData,
        isLoading: isLoadingOrders,
        isSuccess: isOrdersSuccess,
        isError: isOrdersError,
        error: ordersError,
    } = useGetOrdersQuery("ordersList", {
        pollingInterval: 10000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    if (isLoadingOrders) return <PageLoader />;
    if (isOrdersError) return <PageError error={ordersError?.data?.message} />;

    const { entities: ordersEntities } = ordersData;
    const orders = Object.values(ordersEntities).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

    // console.log(orders)
    // Get list of years from orders
    const yearOrders = [...new Set(orders.map(order => new Date(order.dateTime).getFullYear()))];



    // Helper function to get date ranges
    const getDateRange = (type) => {
        const now = new Date();
        const startOfToday = new Date(now.setHours(0, 0, 0, 0));
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of this week
        const startOfLastWeek = new Date(startOfWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        switch (type) {
            case "today":
                return [startOfToday, new Date()];
            case "yesterday":
                return [startOfYesterday, startOfToday];
            case "thisWeek":
                return [startOfWeek, new Date()];
            case "lastWeek":
                return [startOfLastWeek, startOfWeek];
            case "thisMonth":
                return [startOfMonth, new Date()];
            case "lastMonth":
                return [startOfLastMonth, endOfLastMonth];
            case "custom":
                return [new Date(customFromDate), new Date(customToDate)];
            default:
                return [new Date(0), new Date()];
        }
    };

    // Filter orders by selected year
    const filteredByYear = yearFilter === "all"
        ? orders
        : orders.filter(order => new Date(order.dateTime).getFullYear() === parseInt(yearFilter));

    // Get date range based on selected filter
    const [startDate, endDate] = getDateRange(dateFilter);

    // Filter orders by selected date range
    const filteredOrders = filteredByYear
        .filter(order => {
            const orderDate = new Date(order.dateTime);
            return orderDate >= startDate && orderDate <= endDate;
        })
        .filter(order => {
            if (yearFilter !== currentYear.toString() && monthFilter !== "all") {
                const orderMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(order.dateTime));
                return orderMonth === monthFilter;
            }
            return true;
        });

    const totalSales = filteredOrders.reduce((total, order) => total + Number(order.total), 0);


    // Get months only when the selected year is NOT the current year
    const monthsOrders =
        yearFilter !== currentYear.toString()
            ? [...new Set(filteredByYear.map(order =>
                new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(order.dateTime))
            ))]
            : [];



    // Group orders by date
    const groupedSalesOrders = filteredOrders.reduce((acc, order) => {
        const date = new Date(order.dateTime).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        const existingOrder = acc.find(item => item.date === date);
        if (existingOrder) {
            existingOrder.Total += order.total;
        } else {
            acc.push({ date, Total: order.total });
        }
        return acc;
    }, []);

    const totalQty = filteredOrders.reduce((total, order) => {
        return total + order.items.reduce((sum, item) => sum + Number(item.qty), 0);
    }, 0);


    const exportToExcel = () => {
        if (filteredOrders.length === 0) {
            alert("No orders to export.");
            return;
        }

        // Map filtered orders into a format for Excel
        const ordersForExcel = filteredOrders.map(order => ({
            Order_No: order.orderNo,
            Date_Time: order.dateTime,
            Order_Type: order.orderType,
            Barista: order.barista,
            Items: order.items.map(item => `${item.name} (x${item.qty})`).join(", "),
            No_Of_Items: order.items.reduce((total, item) => total + Number(item.qty), 0),
            Total: order.total,
            Cash: order.cash,
            Change: order.change,
        }));

        // Convert JSON data to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(ordersForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

        // Download Excel file
        XLSX.writeFile(workbook, `Sales_Summary_Report_${yearFilter}.xlsx`);
    };

    console.log(yearFilter,  currentYear.toString(), typeof yearFilter, typeof  currentYear.toString());

    return (
        <div aria-label="Page Header">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 no-print">
                <div className="grid grid-cols-1 mt-5">
                    <div className="h-[26rem] min-w-full rounded bg-white col-span-1 lg:col-span-2">

                        <div className="flex flex-col w-full h-full">

                            <div className="flex justify-between py-5 px-5">
                                <div className="flex flex-col sm:flex-row gap-2">

                                    <p className="text-xl font-bold text-gray-700 sm:text-2xl dark:text-gray-200">
                                        Sales Summary
                                    </p>

                                    <div className="flex space-y-2">
                                        {/* <label className="text-xs font-semibold text-gray-500">Filter by Year</label> */}
                                        <select className="border rounded p-1" value={yearFilter} onChange={e => setYearFilter(e.target.value)}>
                                            {yearOrders.map((year, index) => (
                                                <option key={index} value={year}>{year}</option>
                                            ))}
                                            <option value="all">All</option>
                                        </select>
                                    </div>
                                    {yearFilter !== "all"
                                        && (yearFilter !== currentYear.toString()
                                            ? (
                                                <div className="flex space-y-2">
                                                    <select className="border rounded p-1" value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
                                                        <option value="all">All Months</option>
                                                        {monthsOrders.map((month, index) => (
                                                            <option key={index} value={month}>{month}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )
                                            : <div className="flex space-y-2">
                                                {/* <label className="text-xs font-semibold text-gray-500">Filter by Date</label> */}
                                                <select className="border rounded p-1" value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
                                                    <option value="today">Today</option>
                                                    <option value="yesterday">Yesterday</option>
                                                    <option value="thisWeek">This Week</option>
                                                    <option value="lastWeek">Last Week</option>
                                                    <option value="thisMonth">This Month</option>
                                                    <option value="lastMonth">Last Month</option>
                                                    <option value="custom">Custom</option>
                                                    <option value="all">All</option>
                                                </select>
                                            </div>

                                        )}

                                    {

                                    }
                                    {dateFilter === "custom" && (
                                        <div className="flex space-x-2">
                                            <input type="date" className="border rounded p-1" value={customFromDate} onChange={e => setCustomFromDate(e.target.value)} />
                                            <input type="date" className="border rounded p-1" value={customToDate} onChange={e => setCustomToDate(e.target.value)} />
                                        </div>
                                    )}
                                </div>

                                <div
                                    onClick={exportToExcel}
                                    title='Export'
                                    className="flex gap-3 items-center cursor-pointer text-sm px-4 py-2 text-black border dark:text-gray-300 font-medium border-gray-300 dark:border-slate-600  hover:bg-gray-200 dark:hover:bg-gray-800 dark:active:bg-slate-800 rounded-md duration-150"
                                >
                                    Export
                                </div>
                            </div>

                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={groupedSalesOrders} margin={{ top: 25, right: 30, left: 35, bottom: 35 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis tickFormatter={formatCurrency} />
                                    <Tooltip content={(props) => (
                                        <div>
                                            {props.payload?.map((item, idx) => {
                                                return (
                                                    <div className="flex flex-col gap-2 bg-slate-800 border text-xs  font-medium py-3 px-5 rounded-md shadow-lg "
                                                        key={idx}
                                                    >
                                                        <div className="flex gap-1 items-center">
                                                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                            <p className="text-gray-50 font-medium">
                                                                {` ${(item.payload.date)}`}
                                                            </p>
                                                        </div>
                                                        <p className="text-gray-400 text-[11px]">TOTAL:
                                                            <span className="font-medium text-xs text-gray-50 ">
                                                                {formatCurrency(item.payload.Total)}
                                                            </span>
                                                        </p>

                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )} />
                                    <Line type="monotone" dataKey="Total" stroke="orange" strokeWidth={1.5} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="flow-root bg-white mx-auto max-w-screen-xl  border-t-2 rounded">
                    <dl className="mx-5 divide-y divide-gray-200 text-medium">
                        <div className="gap-1 py-3 flex justify-between">
                            <dt className="font-medium text-gray-700">Gross Sales</dt>
                            <dd className="font-medium text-gray-900 ">{formatCurrency(totalSales)}</dd>
                        </div>
                        <div className="gap-1 py-3 flex justify-between">
                            <dt className=" text-gray-700 ml-10">Orders</dt>
                            <dd className=" text-gray-900 ">{filteredOrders.length}</dd>
                        </div>
                        <div className="gap-1 py-3 flex justify-between">
                            <dt className=" text-gray-700 ml-10">Items</dt>
                            <dd className="text-gray-900 ">{totalQty}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Reports;
