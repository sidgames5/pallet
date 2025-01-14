

const Dashboard = () => {
    const recentActivity = [
        {
            type: "item",
            name: "Test",
            timestamp: 1736896045,
            id: 1
        }
    ];
    return (
        <>
            <div className="recent-activity flex flex-col items-center">
                <h4>Recent Activity</h4>
                <div className="flex flex-row flex-wrap items-center text-center justify-center gap-5 max-w-7xl">
                    {(recentActivity.length > 0) ? recentActivity.map((item) => <a href={`/${item.type}/${item.id}`} className="flex flex-col items-center justify-center w-48 h-24 rounded-lg bg-gray-300">
                        <span className="activity-item-name">{item.name}</span>
                        <span className="activity-item-date italic">{(function (date) {
                            const now = new Date();
                            const diff = now - date;
                            const seconds = diff / 1000;
                            const minutes = seconds / 60;
                            const hours = minutes / 60;
                            const days = hours / 24;

                            const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

                            if (days > 1) {
                                return formatter.format(Math.round(-days), "day");
                            } else if (hours > 1) {
                                return formatter.format(Math.round(-hours), "hour");
                            } else if (minutes > 1) {
                                return formatter.format(Math.round(-minutes), "minute");
                            } else if (seconds > 1) {
                                return formatter.format(Math.round(-seconds), "second");
                            } else {
                                return "just now";
                            }

                        })(item.timestamp * 1000)}</span>
                    </a>) : <span className="italic">No recent activity</span>}
                </div>
            </div>
        </>
    );
};

export default Dashboard;