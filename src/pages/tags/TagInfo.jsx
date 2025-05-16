import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Database from "../../utils/Database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function TagInfo() {
    const [db, setDb] = useState(null);
    const [effectDbDone, setEffectDbDone] = useState(false);
    const { tagId } = useParams();
    const [tag, setTag] = useState(null);
    const navigate = useNavigate();

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
                <div className="flex flex-row items-center gap-4">
                    <FontAwesomeIcon icon={faArrowLeft} className="size-8 p-2 bg-gray-700 rounded-lg text-white cursor-pointer transition-all duration-300 hover:bg-sky-600" onClick={() => navigate(-1)} />
                    <div className={`w-8 h-8 rounded-full bg-${tag.color}-500`}></div>
                    <div className="flex flex-col">

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