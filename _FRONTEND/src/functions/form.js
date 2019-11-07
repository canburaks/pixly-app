import { client, cache } from "../index"

export function usernameValidator(text) {
    var patt1 = /[.,~|<>£#{}"'^+%&/()=?_-]/g;
    var result = text.match(patt1);
    return (result && result.length > 0 || text.length < 3) ? false : true
}

export function emailValidator(text) {
    if (text.includes("@") && text.length > 5) {
        let former = text.split("@")[0]
        let latter = text.split("@")[1]
        if (former.length > 2 && latter.includes(".") && latter.length > 2) return true
    } else {
        return false
    }
}
export function passwordValidator(value) {
    if (value.length < 8) return false
    else if (value === value.toLowerCase()) return false
    else if (value === value.toUpperCase()) return false
    else return true
}

export function oldpasswordValidator(value) {
    /*
    if((/[a-z]/.test(value) && /[0-9]/.test(value) && value.length>7)===true 
    || (/[A-Z]/.test(value) && /[0-9]/.test(value) && value.length>7)===true)
    return true
    */
    return /[a-z]/.test(value) && /[0-9]/.test(value) && /[A-Z]/.test(value) && value.length > 7
}




export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function logout() {
    cache.reset()
    client.resetStore();
    localStorage.removeItem("USERNAME")
    localStorage.removeItem("AUTH_TOKEN")
    localStorage.clear("USERNAME");
    localStorage.clear("AUTH_TOKEN");
    localStorage.removeItem("LISTS");
}

export function authError(message) {
    if (message.startsWith("Authentication credentials")) {
        console.log("Authentication Error!!!")
        logout();
    }
}
