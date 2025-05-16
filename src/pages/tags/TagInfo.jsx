import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Database from "../../utils/Database";

export default function TagInfo() {
    const [db, setDb] = useState(null);
    const [effectDbDone, setEffectDbDone] = useState(false);
    const { tagId } = useParams();
    const [tag, setTag] = useState(null);

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
            const tag = db.tags.find(tag => tag.id === parseInt(tagId));
            if (tag) {
                setTag(tag);
            } else {
                console.error("Tag not found");
            }
        }
    }, [db, effectDbDone, tagId]);

    return <div>
        {tag ? (
            <div className="flex flex-col items-center">
                <div className="flex flex-row items-center">
                    <div className={`w-8 h-8 rounded-full bg-${tag.color}-500`}></div>
                    <div className="flex flex-col ml-4">

                        <h1 className="text-2xl font-bold">{tag.name}</h1>
                        <p>{tag.description}</p>
                    </div>
                </div>
            </div>
        ) : (
            <p>Loading...</p>
        )}
    </div>;
}