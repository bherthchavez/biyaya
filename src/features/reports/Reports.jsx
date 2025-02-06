import { use, useEffect, useState } from "react";
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
    const { formatCurrency, formatCurrencyNotation } = useGenerateORDATE();

    const currentYear = new Date().getFullYear();
    const [yearFilter, setYearFilter] = useState(currentYear.toString());
    const [dateFilter, setDateFilter] = useState("all");
    const [customFromDate, setCustomFromDate] = useState("");
    const [customToDate, setCustomToDate] = useState("");
    const [monthFilter, setMonthFilter] = useState("all");

    useEffect(() => {
        yearFilter === "all" && (setMonthFilter("all"), setDateFilter("all"));

        yearFilter !== 'all' && (setMonthFilter("all"), setDateFilter("all"));

    }, [yearFilter])

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


    // Function to clean the dateTime string
    const cleanDateTime = (dateTime) => {
        return dateTime.replace(' at ', ', ');
    };

    const { entities: ordersEntities } = ordersData;
    const orders = Object.values(ordersEntities).sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));


    // Get list of years from orders
    const yearOrders = [...new Set(orders.map(order => {
        const cleanedDateTime = cleanDateTime(order.dateTime);
        return new Date(cleanedDateTime).getFullYear();
    }))];


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

    const filteredByYear = yearFilter === "all"
        ? orders.map(order => {
            const cleanedDateTime = cleanDateTime(order.dateTime);
            return { ...order, dateTime: cleanedDateTime };
        })
        : orders.filter(order => {
            const cleanedDateTime = cleanDateTime(order.dateTime);
            return new Date(cleanedDateTime).getFullYear() === parseInt(yearFilter);
        });

    // Get date range based on selected filter
    const [startDate, endDate] = getDateRange(dateFilter);

    // Filter orders by selected date range
    const filteredOrders = filteredByYear
        .filter(order => {
            const orderDate = new Date(cleanDateTime(order.dateTime));
            return orderDate >= startDate && orderDate <= endDate;
        })
        .filter(order => {
            if (yearFilter !== currentYear.toString() && monthFilter !== "all") {
                const orderMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(cleanDateTime(order.dateTime)));
                return orderMonth === monthFilter;
            }
            return true;
        });

    const totalSales = filteredOrders.reduce((total, order) => total + Number(order.total), 0);


    // Get months only when the selected year is NOT the current year
    const monthsOrders =
        yearFilter !== currentYear.toString()
            ? [...new Set(filteredByYear.map(order => {
                const cleanedDateTime = cleanDateTime(order.dateTime);
                return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(cleanedDateTime));
            }))]
            : [];

    // Helper function to format date
    const formatDate = (date, yearFilter) => {
        const options = yearFilter === "all"
            ? { year: "numeric", month: "short" }
            : { year: "numeric", month: "short", day: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
    };

    // Group orders by date
    const groupedSalesOrders = Array.from(
        filteredOrders.reduce((acc, order) => {
            const date = formatDate(cleanDateTime(order.dateTime), yearFilter);
            if (acc.has(date)) {
                const existingOrder = acc.get(date);
                existingOrder.Total += order.total;
                existingOrder.Items += order.items.reduce((sum, item) => sum + Number(item.qty), 0);
                existingOrder.Orders += 1;
            } else {
                acc.set(date, {
                    date,
                    Total: order.total,
                    Items: order.items.reduce((sum, item) => sum + Number(item.qty), 0),
                    Orders: 1
                });
            }
            return acc;
        }, new Map()).values()
    );



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
            Date_Time: cleanDateTime(order.dateTime),
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


    return (
        <div aria-label="Page Header">
            <div className="mx-auto max-w-screen-xl px-4 py-2 sm:py-8 sm:px-6 lg:px-8 no-print">
                <div className="mt-2 sm:mt-5">
                    <div className="h-[100%] min-w-full rounded bg-white col-span-1 lg:col-span-2">
                        <div className="flex flex-col w-full h-full">
                            {/* Header Section */}

                            <div className="flex sm:flex-row p-5 justify-between gap-2">
                                <div className="flex flex-col sm:flex-row gap-2">

                                    <p className="text-lg font-bold text-gray-700 sm:text-2xl">
                                        Sales Summary
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <select
                                            className="border outline-none border-gray-200 rounded p-1 cursor-pointer hover:bg-slate-100 text-sm"
                                            value={yearFilter}
                                            onChange={(e) => setYearFilter(e.target.value)}
                                        >
                                            {yearOrders.map((year, index) => (
                                                <option key={index} value={year}>
                                                    {year}
                                                </option>
                                            ))}
                                            <option value="all">All</option>
                                        </select>
                                        {yearFilter !== "all" && yearFilter !== currentYear.toString() ? (
                                            <select
                                                className="border border-gray-200 rounded p-1 cursor-pointer hover:bg-slate-100 text-sm"
                                                value={monthFilter}
                                                onChange={(e) => setMonthFilter(e.target.value)}
                                            >
                                                <option value="all">All Months</option>
                                                {monthsOrders.map((month, index) => (
                                                    <option key={index} value={month}>
                                                        {month}
                                                    </option>
                                                ))}
                                            </select>
                                        ) :yearFilter !== "all" ? (
                                            <select
                                                className="border outline-none border-gray-200  rounded p-1 cursor-pointer hover:bg-slate-100 text-sm"
                                                value={dateFilter}
                                                onChange={(e) => setDateFilter(e.target.value)}
                                            >
                                                <option value="today">Today</option>
                                                <option value="yesterday">Yesterday</option>
                                                <option value="thisWeek">This Week</option>
                                                <option value="lastWeek">Last Week</option>
                                                <option value="thisMonth">This Month</option>
                                                <option value="lastMonth">Last Month</option>
                                                <option value="custom">Custom</option>
                                                <option value="all">All</option>
                                            </select>
                                        ): null
                                        }
                                        {dateFilter === "custom" && (
                                            <div className="flex flex-col sm:flex-row gap-2 text-sm">
                                                <input
                                                    type="date"
                                                    className="border rounded p-1 text-black cursor-pointer hover:bg-slate-100"
                                                    value={customFromDate}
                                                    onChange={(e) => setCustomFromDate(e.target.value)}
                                                />
                                                <input
                                                    type="date"
                                                    className="border rounded p-1 text-black cursor-pointer hover:bg-slate-100"
                                                    value={customToDate}
                                                    onChange={(e) => setCustomToDate(e.target.value)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>

                                    <div
                                        onClick={exportToExcel}
                                        title="Export"
                                        className=" cursor-pointer text-sm px-2 sm:px-4 py-2 text-black border font-medium border-gray-300 hover:bg-gray-200 rounded-md duration-150"
                                    >
                                        Export
                                    </div>
                                </div>
                            </div>

                            {/* Graph Section */}
                            <div className="h-[26rem] min-w-full flex">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={groupedSalesOrders}
                                        margin={{ top: 25, right: 20, left: 10, bottom: 50 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <YAxis
                                            tickFormatter={formatCurrencyNotation}
                                            type="number"
                                            axisLine={false}
                                            tickLine={{ stroke: "" }}
                                            className="text-xs font-medium text-gray-600"
                                            domain={[0, 'auto']}
                                            tickCount={5}
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={{ stroke: "" }}
                                            tick={({ x, y, payload }) => (
                                                <text
                                                    x={x}
                                                    y={y}
                                                    dy={10}
                                                    textAnchor="end"
                                                    transform={`rotate(-45 ${x} ${y})`}
                                                    fill="#6e6e6e"
                                                    className="text-xs font-medium"
                                                >
                                                    {payload.value}
                                                </text>
                                            )}
                                            className="text-xs font-medium text-gray-600"
                                        />
                                        <Tooltip
                                            content={({ payload }) => (
                                                <div className="flex flex-col gap-2 bg-slate-800 text-xs font-medium py-3 px-5 rounded-md shadow-lg">
                                                    {payload?.map((item, idx) => (
                                                        <div key={idx}>
                                                            <div className="flex gap-1 items-center">
                                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                                <p className="text-gray-50 font-medium">{item.payload.date}</p>
                                                            </div>
                                                            <div className="text-gray-400 text-[11px]">
                                                                Orders: <span className="font-medium text-xs text-gray-50 pl-2">{item.payload.Orders}</span>
                                                            </div>
                                                            <div className="text-gray-400 text-[11px]">
                                                                Items: <span className="font-medium text-xs text-gray-50 pl-2">{item.payload.Items}</span>
                                                            </div>
                                                            <div className="text-gray-400 text-[11px]">
                                                                TOTAL: <span className="font-medium text-xs text-gray-50 pl-2">{formatCurrency(item.payload.Total)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        />
                                        <Line type="monotone" dataKey="Total" stroke="#5eba00" strokeWidth={1.8} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="mt-2 flow-root bg-white mx-auto max-w-screen-xl rounded">
                    <dl className="mx-5 divide-y divide-gray-200">
                        <div className="gap-1 py-3 flex justify-between text-lg">
                            <dt className="font-medium text-green-700">Gross Sales</dt>
                            <dd className="font-medium text-green-700">{formatCurrency(totalSales)}</dd>
                        </div>
                        <div className="gap-1 py-3 flex justify-between">
                            <dt className="text-gray-700 ml-10">Orders</dt>
                            <dd className="text-gray-900">{filteredOrders.length}</dd>
                        </div>
                        <div className="gap-1 py-3 flex justify-between">
                            <dt className="text-gray-700 ml-10">Items</dt>
                            <dd className="text-gray-900">{totalQty}</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default Reports;
