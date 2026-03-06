const API_URL = "/api";

export const registerCall = async (emailVal,passwordVal) => {
    console.log("emailVal:", emailVal)
    console.log("passwordVal:", passwordVal);
    try{
        const response = await fetch(`${API_URL}/registrazione`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({email: emailVal, password: passwordVal})
        });

        if(response.ok) {
            return
        }
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
    }
    catch(err){
        console.log("fetch error:", err.message);
        throw err;
    }
}