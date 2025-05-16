import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Database from "../../utils/Database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateTag from "./CreateTag";

export default function Tags() {
    const [db, setDb] = useState(null);
    const [effectDbDone, setEffectDbDone] = useState(false);
    const [tags, setTags] = useState([
    ]);
    const [showCreateTagModal, setShowCreateTagModal] = useState(false);

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
            {tags.map((tag) => (
                <Link
                    key={tag.id}
                    className="bg-gray-400 text-black p-4 rounded-lg flex flex-col items-center gap-2"
                    to={`/tags/${tag.id}`}
                >
                    <div
                        className="p-4 rounded-full w-8 h-8"
                        style={{ backgroundColor: tag.color }}
                    ></div>
                    <span>{tag.name}</span>
                    <span>0 items</span> {/*TODO: make this actually count the items*/}
                </Link>
            ))}
        </div>

        <FontAwesomeIcon className="fixed bottom-5 right-5 size-10 p-4 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-sky-600 transition-all duration-300" icon={faPlus} onClick={() => setShowCreateTagModal(true)} />
        {showCreateTagModal && <CreateTag
            onClose={() => setShowCreateTagModal(false)}
            onSubmit={(e) => {
                const formData = new FormData(e.currentTarget);

                const requestData = {
                    key: "tags",
                    data: {
                        name: formData.get("name"),
                        description: formData.get("description"),
                        color: formData.get("color")
                    }
                };

                Database.create(requestData);
                Database.read().then((d) => {
                    let path = `/tags/${d.tags[d.tags.length - 1].id}/`;
                    window.location.href = path;
                })
            }}
        />}
    </div>;
}