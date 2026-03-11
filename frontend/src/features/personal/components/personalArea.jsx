import { useLoadDocs } from "../hooks/useLoadDocs";
import { useEffect } from "react";

export const PersonalArea = () => {
    const { handleLoadDocs, docs } = useLoadDocs();

    useEffect(() => {
        handleLoadDocs();
    }, []);

    console.log(docs);

    return (
        <div>
            <h1>Personal Area</h1>
            <p>Welcome to your personal area!</p>
            <h2>Your Documents:</h2>
            <ul>
                {docs.map((name) => (
                    <button key={name}>{name}</button>
                ))}
            </ul>
        </div>
    );
}