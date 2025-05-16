import { Outlet } from "react-router-dom";

export default function TagsLayout() {
    return <>
        <div className="flex flex-col mt-4 items-center justify-center">
        </div>

        <div className="container flex flex-col items-center mx-auto w-full"><Outlet /></div>
    </>;
}