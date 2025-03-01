import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function BarcodeScanModal() {
    const [data, setData] = useState("Point the camera to a barcode");
    return <div className="bg-gray-300 p-8 rounded-lg w-fit max-w-[40%] fixed flex flex-col justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p>Scan barcode</p>
        <BarcodeScannerComponent
            width={500}
            height={500}
            onUpdate={(err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                if (result) setData(result.text);
            }}
            onError={(err) => console.error(err)}
        />
        <p>{data}</p>
    </div>
}