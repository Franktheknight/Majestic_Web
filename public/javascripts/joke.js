const getrandBadJoke = async() => {
    try {
        const config = {headers: {Accept: "application/json"}};
        const res = await axios.get("https://icanhazdadjoke.com/", config);
        return res.data.joke;
    } catch(error) {
        return "No Jokes available at the moment, sad..."
    }
}
const showjoke = async () => {
    const joke = await getrandBadJoke();
    const joketag = document.querySelector("#jokecard");
    joketag.removeChild(joketag.firstChild);
    const text = document.createTextNode(joke);
    joketag.appendChild(text);
}

showjoke();





