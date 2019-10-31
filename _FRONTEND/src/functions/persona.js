
export class Persona{
    constructor(raw){
        this._ratingset = preprocess(raw)
    }

    get ratingset(){
        return this._ratingset
    }
    get keyset(){
        return Object.keys(this._ratingset)
    }
    get values(){
        return Object.values(this._ratingset)

    }
    mean(){
        const total = this.values.reduce((sum, rating)=> sum+= rating,0)
        return total/this.values.length
    }
    variance(){
        const average = this.mean();
        const varyans = this.values.reduce((sum, rating)=> sum += (rating - average)**2)
        return varyans/ this.values.length
    }
    
    intersection(otherPersona){
        const intersection = this.keyset.filter(movie => otherPersona.keyset.includes(movie))
        return intersection
    }
    similarity(otherPersona){
        const commonMovies = this.intersection(otherPersona);
        if(commonMovies.length===0){
            console.log("no common")
            return 0
        }
        const v1 = this.ratingset
        const v2 = otherPersona.ratingset
        const ubar = this.mean()
        const jbar = otherPersona.mean()
        
        var top = 0;
        var bl = 0;
        var br=0;

        commonMovies.forEach(m =>{
            top += ( v1[m] - ubar) * ( v2[m] - jbar)
            bl += ( v1[m] - ubar)**2
            br += ( v2[m] - jbar)**2
        })
        if(bl*br===0){
            console.log("zero division")
            return 0
        }
        return top / ( (bl*br)**0.5 )
    }
}

export function p2p(raw1, raw2){
    //check if users have any ratingset
    if(raw1 && raw2){
        const info = {}
        const p1 = new Persona(raw1);
        const p2 = new Persona(raw2);

        //check again for length of users ratingset
        if(p1.keyset.length>1 && p2.keyset.length>1){
            info.quantity = p1.intersection(p2).length;
            info.similarity = p1.similarity(p2);
            info.valid = true
            return info;
        }
        return { quantity:-1, similarity:-1, valid:false}
    }
    return { quantity:-1, similarity:-1, valid:false}    
}


// If input is json string converts it to js object
export function preprocess(input){
    var output = Object();
    if(typeof input==="string"){
        output = JSON.parse(input);
    }
    else if(typeof input==="object"){
        output = input;
    }
    return output;
}

export const calculateSimilarity = (ratingset1, ratingset2) => {
    const info = p2p(ratingset1, ratingset2)
    info.percent = Math.round((0.5 + info.similarity/2)*100)
    info.valid = info.quantity > 4
    info.message = message(info)
    return info
}
const message = (info)=>{
    if(info.quantity<5) return `Similarity calculation at least need 5 common movies. You both watched ${info.quantity} movies`
    else return `You both has ${info.percent} percent similar cinema taste. You both watched ${info.quantity} same movies.`
}