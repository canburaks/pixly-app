
export function PersonData(person) {
    const data = {
        "@type": "Person",
        "name": person.name,
    };
    return data
}

export function MovieData(movie){
    const data = {
        "@context": "http://schema.org/",
        "@type": "Movie",
        "name":movie.name,
        "about": movie.summary,
        "image":movie.coverPoster ? movie.coverPoster : movie.poster
    };
    //DIRECTOR
    if (movie.director){
        data["director"] = PersonData(movie.director[0])
    }
    //ACTOR
    if (movie.crew){
        data["actor"] = movie.crew.filter(c => c.job === "A").map(c => PersonData(c.person))
    }
    //console.log("movie data", JSON.stringify(data))
    return JSON.stringify(data)
}

export function DirectorData(director, socials){
    const data = {
        "@context": "http://schema.org/",
        "@type": "Person",
        "name": director.name,
        "image": director.poster,
        "jobTitle": "Director"
    };
    if (socials){
        data["sameAs"] = socials
    }
    return JSON.stringify(data)
}