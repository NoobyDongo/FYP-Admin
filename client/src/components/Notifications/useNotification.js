'use client'

export function useNotification() {
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
        if (response.error?.status) {
            makeNew(`Status: ${error.error.status}, Error: ${error.error.error}`, "error")
            return true
        }else if(response.error){
            makeNew(`Error: ${response.error}`, "error")
            return true
        }
        return false
    }
    return { normal: makeNew, error: makeError }
}