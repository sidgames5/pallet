import { useNavigate } from "react-router-dom";

function NoPage() {
    let navigate = useNavigate();
    return (
        <>
            <h1>Page not found</h1>
            <button onClick={() => navigate(-1)}>Go back</button>
        </>
    );
}

export default NoPage;