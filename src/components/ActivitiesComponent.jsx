import { LuClock3 } from "react-icons/lu";
import Spinner from "./Spinner";
import UserLastLogin from "./UserLastLogin";
import { useState, useEffect, useRef } from 'react';
import { IoReceiptOutline } from "react-icons/io5";

const ActivitiesComponent = ({ logs, onUpdateLog }) => {
    const [visibleLogs, setVisibleLogs] = useState(4);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    const loadMoreLogs = () => {
        if (loading) return;
        setLoading(true);
        setTimeout(() => {
            // Increment exactly 4 logs on each load, ensuring we don't load more than the total number of logs
            setVisibleLogs(prev => {
                const remainingLogs = logs.length - prev;
                const increment = remainingLogs >= 4 ? 4 : remainingLogs; // Load exactly 4 or the remaining logs
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

            if (isBottom && visibleLogs < logs.length) {
                loadMoreLogs();
            }
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [visibleLogs, logs.length]);

    const renderLogItem = (log, idx) => (
        <div
            key={idx}
            onClick={() => onUpdateLog(log)}
            title={log?.orderID ? `Click to view receipt` : `Click to mark as read`}
            className={`${!log?.seen ? ` bg-gray-100  hover:bg-gray-50` : `bg-white hover:bg-gray-100`} relative hover:bg-gray-100 cursor-pointer items-center gap-3 py-4 px-5 border-b border-gray-200 text-sm`}>
            {!log?.seen
                && <div className="p-1 absolute top-3 right-3 bg-red-500 rounded-full animate-pulse"></div>
            }
            <div className="flex justify-between gap-4 sm:gap-8 ">
                <div className="text-xs flex gap-2 justify-center items-center">
                    <img
                        title={log?.name}
                        alt="Profile"
                        src={log.avatar}
                        className="h-10 w-10 rounded-full object-cover"
                    />

                    <div className="flex flex-col justify-center">
                        <div className="flex gap-2">
                            {log?.orderID && (
                                <div className="my-auto text-gray-500">
                                    <IoReceiptOutline size={16} />
                                </div>
                            )}
                            <h2 className="font-semibold">{log?.actionType}</h2>
                        </div>
                        <div className="flex gap-2">
                            <h2 className="text-gray-600">{log?.description}</h2>
                        </div>
                    </div>

                </div>
                <div
                    title={log.date}
                    className="flex gap-1 items-center text-xs sm:text-sm whitespace-nowrap text-gray-600">
                    <LuClock3 size={15} className="text-gray-400" />
                    <UserLastLogin lastLoginTime={log.date} />
                </div>

            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="h-72 overflow-auto">
            {logs.length ? (
                logs.slice(0, visibleLogs).map(renderLogItem)
            ) : (
                <div className="flex">
                    <p className="mx-auto my-5 text-gray-500">No logs found!</p>
                </div>
            )}
            {loading && (
                <div className="flex py-4 justify-center">
                    <Spinner />
                </div>
            )}
        </div>
    );
};

export default ActivitiesComponent;
