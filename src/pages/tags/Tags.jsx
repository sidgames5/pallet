import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Database from "../../utils/Database";

export default function Tags() {
    const [db, setDb] = useState(null);
    const [effectDbDone, setEffectDbDone] = useState(false);
    const [tags, setTags] = useState([
    ]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const data = await Database.read();
                if (isMounted) {
                    setDb(data);
                }
            } catch (e) {
                console.error("Error: ", e);
            } finally {
                if (isMounted) {
                    setEffectDbDone(true);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (db && effectDbDone) {
            const tags = db.tags.map(tag => ({
                id: tag.id,
                name: tag.name,
                color: tag.color,
                description: tag.description
            }));
            setTags(tags);
        }
    }, [db, effectDbDone]);

    return <div>
        <div className="flex flex-wrap w-full gap-4">
            {tags.map((tag) => <Link key={tag.id} className="bg-gray-400 text-black p-4 rounded-lg flex flex-col items-center gap-2" to={`/tags/${tag.id}`}>
                <div className={`p-4 rounded-full bg-${tag.color}-500 w-0 h-0`}></div>
                <span>{tag.name}</span>
                <span>0 items</span> {/*TODO: make this actually count the items*/}
            </Link>)}
        </div>
    </div>;
}