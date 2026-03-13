import { useLoadDocs } from "../hooks/useLoadDocs";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDocName } from "../../../context/openedDocContext";

export const PersonalArea = () => {
    const { handleLoadDocs, docs } = useLoadDocs();
    const navigate = useNavigate();
    const {openDocument} = useDocName();

    useEffect(() => {
        handleLoadDocs();
    }, []);

    const handleOpenDocument = (name) => {
        openDocument(name);
        navigate("/editor");
    };

    return (
        <div>
            <h1>Personal Area</h1>
            <p>Welcome to your personal area!</p>
            <h2>Your Documents:</h2>
            <ul>
                {docs.map((name) => (
                    <button onClick={() => handleOpenDocument(name)} key={name}>
                        {name}
                    </button>
                ))}
            </ul>
        </div>
    );
}