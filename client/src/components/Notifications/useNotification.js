export default function useNotification() {
    const makeNew = (message, variant) => {
        window.dispatchEvent(
            new CustomEvent("newNotification", {
                detail: {
                    message, variant
                }
            })
        );
    }
    const makeError = (response) => {
        if(response?.error){
            console.log("Error:", response.error)
            makeNew(`Error: ${response.error}`, "error")
            return true
        }
        return false
    }
    return { normal: makeNew, error: makeError }
}