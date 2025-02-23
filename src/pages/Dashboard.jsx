import { faBox, faDoorOpen, faPallet, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router-dom";


const Dashboard = () => {
    window.location.href = "/explorer";
    const recentActivity = [
        {
            type: "item",
            name: "Test",
            timestamp: 1736896045,
            id: 1
        },
        {
            type: "shelf",
            name: "A7",
            timestamp: 1736901505,
            id: 2
        },
        {
            type: "area",
            name: "Storage Room",
            timestamp: 1736901554,
            id: 3
        },
        {
            type: "building",
            name: "Warehouse A",
            timestamp: 1736950676,
            id: 4
        }
    ];
    return (
        // <div className="grid grid-cols-2 gap-y-10">
        <div className="flex flex-col justify-center items-center">
            {/* <div className="recent-activity flex flex-col items-center justify-center">
                <h4>Recent Activity</h4>
                <div className="flex flex-row flex-wrap items-center text-center justify-center gap-5 max-w-7xl">
                    {(recentActivity.length > 0) ? (function (list) {
                        const l = list.reverse().filter((item) => {
                            const now = Date.now() / 1000;
                            const diff = now - item.timestamp;
                            return Math.abs(diff) <= (60 * 60 * 24);
                        });

                        const maxLength = 6;
                        if (l.length <= maxLength) {
                            return l;
                        }
                        l.splice(maxLength);
                        return l;
                    })(recentActivity).map((item) => <Link to={`/explorer/${item.type}/${item.id}`} className="flex flex-col items-center justify-center w-48 h-24 rounded-lg bg-gray-300">
                        <FontAwesomeIcon className="size-10 text-gray-700" icon={(function (type) {
                            switch (type) {
                                case "item":
                                    return faBox;
                                case "shelf":
                                    return faPallet;
                                case "area":
                                    return faDoorOpen;
                                case "building":
                                    return faWarehouse;
                                default:
                                    return faBox;
                            }
                        })(item.type)} />grid grid-cols-2 gap-y-10

                            const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

                            if (days >= 365) {
                                return formatter.format(Math.round(-days / 365), "year");
                            } else if (days >= 30) {
                                return formatter.format(Math.round(-days / 30), "month");
                            } else if (days >= 1) {
                                return formatter.format(Math.round(-days), "day");
                            } else if (hours >= 1) {
                                return formatter.format(Math.round(-hours), "hour");
                            } else if (minutes >= 1) {
                                return formatter.format(Math.round(-minutes), "minute");
                            } else if (seconds >= 1) {
                                return formatter.format(Math.round(-seconds), "second");
                            } else {
                                return "just now";
                            }

                        })(item.timestamp * 1000)}</span>
                    </Link>) : <span className="italic">No recent activity</span>}
                </div>
            </div> */}
            <h1>Nothing to see here</h1>
            <NavLink to="/explorer"><h6>Go to explorer</h6></NavLink>
        </div>
    );
};

export default Dashboard;