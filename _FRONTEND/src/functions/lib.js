var development = false
if (window.location.href.includes("local")) {
    development = true
}

export function isEqualObj(a,b){
   // Create arrays of property names
   var aProps = Object.getOwnPropertyNames(a);
   var bProps = Object.getOwnPropertyNames(b);

   // If number of properties is different,
   // objects are not equivalent
   if (aProps.length != bProps.length) {
       return false;
   }

   for (var i = 0; i < aProps.length; i++) {
       var propName = aProps[i];

       // If values of same property are not equal,
       // objects are not equivalent
       if (a[propName] !== b[propName]) {
           return false;
       }
   }

   // If we made it this far, objects
   // are considered equivalent
   return true;
}

function benchmark(iterations, f) {
    var start = new Date();
    for (var i = 0; i < iterations; i++) {
      f();
    }
    var end = new Date();
    return "Elapsed time: " + (end - start) + " msec";
  }

  //export const movieCacheUpdate = (client, slug, newData) => {
//	const { movie } = client.readQuery({ query: MOVIE, variables:{slug} });
//	console.log("read query", movie)
//	client.writeQuery({ query: MOVIE, variables:{slug}, data: { movie: {...movie, ...newData }}});
//}

export function clsx() {
    function toVal(mix) {
        var k, y, str='';
        if (mix) {
            if (typeof mix === 'object') {
                if (!!mix.push) {
                    for (k=0; k < mix.length; k++) {
                        if (mix[k] && (y = toVal(mix[k]))) {
                            str && (str += ' ');
                            str += y;
                        }
                    }
                } else {
                    for (k in mix) {
                        if (mix[k] && (y = toVal(k))) {
                            str && (str += ' ');
                            str += y;
                        }
                    }
                }
            } else if (typeof mix !== 'boolean' && !mix.call) {
                str && (str += ' ');
                str += mix;
            }
        }
        return str;
    }
	var i=0, x, str='';
	while (i < arguments.length) {
		if (x = toVal(arguments[i++])) {
			str && (str += ' ');
			str += x
		}
	}
	return str;
}




function detectmob() {
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true;
    }
    else {
        return false;
    }
}

export function rgbGradient(arrays, opacity=0.3, degree=90){
    const filterLightColors = arrays.filter(c => (parseFloat(c[0]) + parseFloat(c[1]) + parseFloat(c[2])<550))
    const sorted = filterLightColors.sort(function(a,b){return a[0] - b[0]})
    //console.log("rgb function", sorted)
    const colors = [`linear-gradient(${degree}deg`];
    const quantity = sorted.length;
    sorted.map((c,i) => (
        colors.push(`rgba(${Math.trunc(c[0])}, ${Math.trunc(c[1])}, ${Math.trunc(c[2])}, ${opacity}) ${Math.trunc((i * (100/(quantity-1))))}%`)
        ))
    const css = colors.join(", ") + ")"
    return css
}

export function authCheck(){
    if (localStorage.getItem("USERNAME") !== null && localStorage.getItem("AUTH_TOKEN") !== null){
        return true
    }
    return false
}

export function print(text, object=null, log=development){
    if (log){console.log(text, object)}
}

export function RouteParams(props, offset){
    const result = {}
    const {id, page, search} = props.match.params;
    if(page){
        result.first = offset;
        result.skip = (page - 1) * offset;
    }
    if(id){
        result.id = id
    }
    if(search){
        result.search = search
    }
    return result
}

export function setLocalStorage(key, value){
    localStorage.setItem(key, JSON.stringify(value))
}



export function ResponsiveSize(width, s=480, m=736, l=980, xl=1280 ){
    if (width<=s) return "S";
    else if (width<m && width>=s) return "M";
    else if (width<l && width>=m) return "L";
    else if (width<xl && width>=l) return "XL";
    else if(width>2000 && width>=xl) return "XXL";
    else if (width >=2000) return "XXXL"
}

export function sizeConversion(width, s=480, l=735 ){
    if (width<s) return "S";
    else if (width<l && width>=s) return "M";
    else if(width>=l) return "L";
}

export function checkOverFlow(itemsLength, limit){
    if(itemsLength>limit) return true
    return false
}

//w3CSS Size adjusting wrt window.innerWidth
export function responsiveQuantity(screenSize,s,m,l ){
    if (screenSize==="S") return s;
    else if (screenSize==="M") return m;
    else if(screenSize==="L") return l;
}



export function textShorten(string, limit, state){
    //If show all text
    if(state) return string; 
    //Trim and split text, then merge sentences
    else {
        const shortRaw = string.slice(0,limit);
        const splitted = shortRaw.split(".");
        const shortText = splitted.slice(0, -1).join(".") + "."
        return shortText;
    }
}

export function extractSource(url){
    if (url.includes("vimeo")) return "vimeo"
    else if (url.includes("youtube")) return "youtube"
}

export function extractYouTubeId(url){
    var splitted_url = url.split("watch?v=")
    if (splitted_url.length>0){
        var rightPart = splitted_url[1]
        if (rightPart.includes("&")){
            var yt_id = rightPart.split("&")[0]
            return yt_id
        }
        else return rightPart
    }
}

export function extractVimeoId(url){
    var splitted_url = url.split("com/")
    if (splitted_url.length>0){
        var rightPart = splitted_url[1];
        return rightPart
    }
}

export function thumbnailUrl(yt_id){
    return `http://img.youtube.com/vi/${yt_id}/hqdefault.jpg`
}

export function urlToThumbUrl(url){
    const yt_id = extractYouTubeId(url)
    if (yt_id){
        const thumbUrl = thumbnailUrl(yt_id);
        return thumbUrl
    }
}

export function videojsYTData(url){
    const dataSetup = {"youtube": { "ytControls": 2 } };
    dataSetup["techOrder"] = ["youtube"];
    
    const sources = [{"type": "video/youtube","src":url}];
    dataSetup["sources"] = sources;
    console.log(dataSetup)
    return JSON.stringify(dataSetup)
}

export function YTEmbed(url){
    const yt_id =  extractYouTubeId(url);
    return `https://www.youtube.com/embed/${yt_id}`
}

export  function PathFinder(object){
    var path;
    if(object.startsWith("d")){
        path = "director"
    } else if (object.startsWith("p")){
        path = "person"
    } else if (object.startsWith("l")){
        path = "lists"
    } else if (object.startsWith("t")){
        path = "topics"
    } else if (object.startsWith("m")){
        path = "movies"
    }
    return path;
}

export  function followObjectFinder(object){
    var path;
    if(object.startsWith("d") || object.startsWith("p")){
        path = "person"
    } else if (object.startsWith("l")){
        path = "liste"
    } else if (object.startsWith("t")){
        path = "topic"
    } else if (object.startsWith("u")){
        path = "targetProfile"
    } 
    return path;
}

export function newQueryVariables(listName, props, lpp){
    // listname is either bookmark or ratings
    const pathname = props.location.pathname;
    const rawVariables = pathname.split(`/${listName}`);
    const username = rawVariables[0].split("/")[1];
    const page = parseInt(rawVariables[1].split("/")[1]) || 1;

    const skip = (page - 1) * lpp ; 
    const first = lpp;

    return { username, first, skip };
}

export function QueryVariables(params, lpp=null){
    if (!lpp && params.id.includes("nm")){
        return { id:params.id}
    }
    // lpp = LINKS_PER_PAGE
    const id = parseInt(params.id) || null;
    const name = params.name || null;
    const search = params.search || null;
    const item = params.item || null;
    const page = parseInt(params.page) || 1;
    const skip = (page - 1) * lpp ; 
    const first = lpp;
    if (item) return { id,name, item,search, first, skip }
    else return { id,name, search, first, skip, page }
}

export function handlePaginationChange(e, { activePage }){
    this.setState({ activePage })

    const path = this.props.match.path
if (this.props.match.params.id){
    const newPath = `${this.state.params.id}/${activePage}`; 
    this.props.history.push(path.replace(":id/:page",newPath))
    }
}

export function DateToString(date){
    const rawDate = date.toLocaleDateString().split("/");
        if(rawDate[0].length===1){
            rawDate[0]= `0${rawDate[0]}`
        }
        if(rawDate[1].length===1){
            rawDate[1]= `0${rawDate[1]}`
        }
        const newDate = [rawDate[2], rawDate[0], rawDate[1]].join("-")
        return newDate;
}
// var a = new Date()
// DateConverter(a)

export function StringToDate(str){
    var newStr = str.replace("-","/")
    var newNewStr = newStr.replace("-","/")
    var date = new Date(newNewStr)
    return date
}

export function monthName(monthDigit) {
    switch(monthDigit){
        case 1:
            return "January"
        case 2:
            return "February"
        case 3:
            return "March"
        case 4:
            return "April"
        case 5:
            return "May"
        case 6:
            return "June"
        case 7:
            return "July"
        case 8:
            return "August"
        case 9:
            return "September"
        case 10:
            return "October"
        case 11:
            return "November"
        case 1:
            return "December"
    }
}

export function PredictionWarning(movie){
    if (movie.viewerRating){
        return "You have already rated this movie"
    } else if (movie.viewerPoints<40){
        return `You should at least rate 40 movies to get prediction.(${40 - movie.viewerPoints} left.)`
    } else if (movie.viewerRating===null && movie.viewerPoints>=40){
        return "Predict this movie"
    }
}


export function yearList(start, stop){
    const liste = []
    while(start <= stop){
        liste.push(start);
        start +=10
    }
    return liste
}

/*
    function childrenWithProps(item){
        return  React.Children.map(props.children, (child) => {
                //console.log("chp", child.props)
                //console.log("ch item", item)
                const nc = React.cloneElement(child, {
                    name:item.name,
                    poster: item.poster,
                    owner: item.owner
                })
                //console.log("nc", nc)
                return nc
            })
        }
*/