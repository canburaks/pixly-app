export const navbarheight = "75px"





if (window.location.href.includes("pixly.app")){
    var prod = true
    var dev= false
}

else {
    var prod = false
    var dev= true
}
export const production = prod
export const development = dev

//ALLOWED URLS
export const allowedUrls = require('../../../allowedUrls.json');
//console.log("config",allowedUrls)