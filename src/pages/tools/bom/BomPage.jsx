import { useMemo, useState } from "react";
import axios from "axios";

function parseHeaders(csv) {
    const firstLine = csv.split(/\r?\n/).find((line) => line.trim()) || "";
    const delimiter = firstLine.includes("\t") ? "\t" : ",";
    const headers = [];
    let value = "";
    let quoted = false;
    for (let index = 0; index < firstLine.length; index += 1) {
        const character = firstLine[index];
        if (character === '"') {
            if (quoted && firstLine[index + 1] === '"') {
                value += '"';
                index += 1;
            } else {
                quoted = !quoted;
            }
        } else if (character === delimiter && !quoted) {
            headers.push(value.trim());
            value = "";
        } else {
            value += character;
        }
    }
    headers.push(value.trim());
    return headers.map((header) => header.replace(/^\uFEFF/, "")).filter(Boolean);
}

export default function BomPage() {
    const [csv, setCsv] = useState("");
    const [searchBy, setSearchBy] = useState("id");
    const [idColumn, setIdColumn] = useState("");
    const [quantityColumn, setQuantityColumn] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const headers = useMemo(() => parseHeaders(csv), [csv]);

    function updateCsv(value) {
        setCsv(value);
        const nextHeaders = parseHeaders(value);
        if (!nextHeaders.includes(idColumn)) setIdColumn(nextHeaders[0] || "");
        if (!nextHeaders.includes(quantityColumn)) setQuantityColumn(nextHeaders[1] || nextHeaders[0] || "");
        setResult(null);
        setError("");
    }

    async function checkBom(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);
        try {
            const response = await axios.post("/api/check-bom", { csv, idColumn, quantityColumn, searchBy });
            setResult(response.data);
        } catch (requestError) {
            setError(requestError.response?.data || "Unable to check the BOM.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-4xl px-4 pb-8">
            <h1 className="text-4xl font-bold mb-2">BOM Restock Check</h1>
            <p className="mb-6 text-gray-700">Paste a bill of materials to see what needs restocking before you pick it.</p>
            <form onSubmit={checkBom} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                    CSV or TSV data
                    <textarea
                        value={csv}
                        onChange={(event) => updateCsv(event.target.value)}
                        placeholder={"Part Number,Quantity\nA-100,4\nB-200,2"}
                        rows={9}
                        required
                        className="p-3 border-2 border-gray-300 rounded-lg font-mono"
                    />
                </label>
                <div className="flex flex-col md:flex-row gap-4">
                    <label className="flex flex-col gap-1 flex-1">
                        Search by
                        <select value={searchBy} onChange={(event) => setSearchBy(event.target.value)} className="p-2 rounded-lg border-2 border-gray-300">
                            <option value="id">Item ID</option>
                            <option value="name">Item name</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-1 flex-1">
                        {searchBy === "id" ? "Item ID" : "Item name"} column
                        <select value={idColumn} onChange={(event) => setIdColumn(event.target.value)} required className="p-2 rounded-lg border-2 border-gray-300">
                            <option value="" disabled>Select a column</option>
                            {headers.map((header) => <option key={`id-${header}`} value={header}>{header}</option>)}
                        </select>
                    </label>
                    <label className="flex flex-col gap-1 flex-1">
                        Quantity column
                        <select value={quantityColumn} onChange={(event) => setQuantityColumn(event.target.value)} required className="p-2 rounded-lg border-2 border-gray-300">
                            <option value="" disabled>Select a column</option>
                            {headers.map((header) => <option key={`quantity-${header}`} value={header}>{header}</option>)}
                        </select>
                    </label>
                </div>
                <button type="submit" disabled={loading || headers.length === 0} className="self-start p-3 rounded-lg bg-gray-700 hover:bg-sky-600 disabled:bg-gray-400 transition-all text-white">
                    {loading ? "Checking..." : "Check what needs restocking"}
                </button>
            </form>

            {error && <p role="alert" className="mt-6 p-3 rounded-lg bg-red-100 text-red-800">{error}</p>}
            {result && (
                <section className="mt-8">
                    <h2 className="text-2xl font-bold mb-2">{result.ready ? "Everything is ready to pick" : "Restock required"}</h2>
                    <p className="mb-4">{result.checked} unique item{result.checked === 1 ? "" : "s"} checked.</p>
                    {result.restock.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-white bg-sky-600">
                                    <tr><th className="p-2">ID</th><th className="p-2">Item</th><th className="p-2">Required</th><th className="p-2">In stock</th><th className="p-2">Restock</th><th className="p-2">Reorder</th></tr>
                                </thead>
                                <tbody>
                                    {result.restock.map((item) => (
                                        <tr key={item.id} className="border-b-2 border-gray-300">
                                            <td className="p-2">{item.id}</td>
                                            <td className="p-2">{item.name}{!item.found && <span className="ml-2 text-red-700">(not found)</span>}</td>
                                            <td className="p-2">{item.required}</td>
                                            <td className="p-2">{item.stock}</td>
                                            <td className="p-2 font-bold">{item.restock}</td>
                                            <td className="p-2">
                                                {item.reorderLink && /^https?:\/\//i.test(item.reorderLink) && (
                                                    <a
                                                        href={item.reorderLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-block px-2 py-1 rounded-lg bg-blue-700 text-white hover:bg-sky-600"
                                                    >
                                                        Reorder
                                                    </a>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
}
