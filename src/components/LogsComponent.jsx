import { LuClock3 } from "react-icons/lu";
import Spenner from "./Spinner";
import UserLastLogin from "./UserLastLogin";
import { useState, useEffect, useRef } from 'react';

const LogsComponent = ({ logs, onUpdateLog }) => {
    const [visibleLogs, setVisibleLogs] = useState(4);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    const loadMoreLogs = () => {
        if (loading) return;
        setLoading(true);
        setTimeout(() => {
            setVisibleLogs(prev => Math.min(prev + 4, logs.length));
            setLoading(false);
        }, 1000); // Simulate a loading delay of 1 second
    };

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight && visibleLogs < logs.length) {
            loadMoreLogs();
        }
    };


    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [loading]);

    return (
        <div ref={containerRef} className="h-72 overflow-auto">
            {logs.length
                ? logs.slice(0, visibleLogs).map((log, idx) => (
                    <div
                        key={idx}
                        onClick={() => onUpdateLog(log)}
                        title="Click to mark as read"
                        className={`${!log?.seen ? ` bg-gray-100 hover:bg-50` : `bg-white hover:bg-gray-100`} relative flex  cursor-pointer justify-between items-center gap-3 py-4 px-5 border-b border-gray-200 text-sm`}>
                        {!log?.seen
                            && <div className="p-1 absolute top-3 right-3 bg-red-500 rounded-full animate-pulse"></div>
                        }
                        <div className="flex gap-3 relative items-center">
                            <img
                                alt="Profile"
                                src={log.avatar}
                                className="h-10 w-10 rounded-full object-cover "
                            />
                            <h2 className="font-semibold text-gray-600">{log.name}</h2>


                        </div>
                        <div className="text-xs sm:text-sm  text-gray-600 w-24 ">
                            {/* <h2 className="text-wrap">{log?.deviceInfo?.device}</h2>
                            <h2 className="text-wra">{log?.deviceInfo?.platform}</h2> */}

                            <p title={log.date} className="flex items-center justify-end gap-1"> <LuClock3 size={15} className="text-gray-400" /> <UserLastLogin lastLoginTime={log.date} /></p>

                        </div>
                    </div>
                ))
                : <div className="flex">
                    <p className="mx-auto my-5 text-gray-500">No logs found!</p>
                </div>
            }
            {loading && (
                <div className="flex py-4 justify-center">
                    <Spenner />
                </div>
            )}
        </div>
    );
};

export default LogsComponent;

