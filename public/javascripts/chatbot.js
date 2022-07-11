const triggerBtn = document.querySelector("#iconChat");
const iconBot = document.querySelector("#iconBot")
const chatbtn = document.querySelector(".chatbotbtn");
const chatwindow = document.querySelector(".chatbotwindow");
const switchBtn = document.querySelector("#uniqueBtn");
const chatinterface = document.querySelector(".chatbotinterface");
const userinput = document.querySelector("#inputfromuser");
const sendBtn = document.querySelector("#send");
let userchat;
//decalre some messages and some regex
let re1 = new RegExp(".*[fF]rank.*");
let re2 = new RegExp(".*[aA]bout.*");
let re3 = new RegExp(".*hello|hey|hi|greeting|yo|what.*up.*");
let re4 = new RegExp(".*[pP]roject.*");
let re5 = new RegExp(".*[sS]kill.*");
let re6 = new RegExp(".*[hH]obb.*");
const msg = [
    "Welcome to Frank's Web, I hope you will enjoy your time visiting here and get to know who frank is in the end. I am still learning, type some key words like frank, about, project and so on.",
    "Hello there, I hope you are enjoying your visit here. You can ask me something like frank, about, project, skills, hobbies to get started.",
    "Greetings, this is Franky. I am here to help introducing frank to you! Please feel free to ask something like, frank, project, hobbies ..."
]
const msge = [
    "Sorry I don't understand, try to type some keywords and see if I have any match.",
    "Tell you a secret, I am not an intelligent being ... try to ask this in another way to see if I have a match",
    "Apologies, my friend. Try to ask again in another way and see if I can answer that."
]

document.addEventListener("keypress", function(event) {
    if(event.key === "Enter") {
        event.preventDefault();
        sendBtn.click()
    }
})

triggerBtn.onclick = function () {
    chatbtn.hidden = true;
    chatwindow.hidden = false;
    chatMessage(msg[Math.floor(Math.random()*msg.length)], false);
}

switchBtn.onclick = function () {
    chatbtn.hidden = false;
    chatwindow.hidden = true;
    //delete all the conversations
    while(chatinterface.firstChild) {
        chatinterface.removeChild(chatinterface.firstChild);
    }
}


//use this as a loop to make some conversations
sendBtn.onclick = function () {
    userchat = userinput.value;
    toCompare = userchat.toLowerCase();
    if (re1.test(toCompare)) {
        chatMessage(userchat);
        chatMessage("Frank is currently studying electrical engineering at UCSD, he always like to tinker with stuff since his youth, see about page for more details", false);
    } else if (re2.test(toCompare)) {
        chatMessage(userchat);
        chatMessage("This website is just a way to show what Frank has learned so far in computer science. He also always dreamed of having a really great web for himself one day, maybe it is one step closer to that goal.", false);
    } else if (re3.test(toCompare)) {
        chatMessage(userchat);
        chatMessage("Hello there, my friend. I hope you are having a good time visiting the web here. Feel free to ask me something.", false);
    } else if (re4.test(toCompare)) {
        chatMessage(userchat);
        chatMessage("Frank has done many project for the past year. This website, so far, might just be his favorite project yet to exist. Check out his project page for more projects!", false);
    } else if (re5.test(toCompare)) {
        chatMessage(userchat);
        chatMessage("Frank, as a future engineer, has the basic skills of circuit analysis, software programming, CAD modeling and something else. If you are interested in contact him, feel free to email him at the address below.", false);
    } else if (re6.test(toCompare)) {
        chatMessage(userchat);
        chatMessage("Well, he likes to play saxophone, especially Jazz. He is trully passionate about that music, there will be a music page in the near future! Besides that, he is just like a regular person doing regular people stuff.", false);
    } else if(toCompare === "login") {
        chatMessage("Welcome Frank, please enter the password to login", false);
        secretLogin();
        userinput.value = "";
    } else if(toCompare === "logout") {
        chatMessage("Are you sure to logout, Frank?", false);
        secretLogout();
        userinput.value = "";
    } else if (toCompare) {
        chatMessage(userchat);
        chatMessage(msge[Math.floor(Math.random()*msge.length)], false);
    }
}

function chatMessage(msg, user = true) {
    const newDiv = document.createElement("div");
    if(!user) {
        let botClone = iconBot.cloneNode(true);
        newDiv.appendChild(botClone);
    }
    const text = document.createTextNode(msg);
    newDiv.appendChild(text);
    if (user) {
        newDiv.classList.add("userinput");
    } else {
        newDiv.classList.add("botinput");
    }
    chatinterface.append(newDiv);
    chatinterface.scrollTop = chatinterface.scrollHeight;
    if (user) userinput.value = "";
}

function secretLogin() {
    const newForm = document.createElement("form");
    newForm.setAttribute("action", "/login");
    newForm.setAttribute("method", "POST");
    const passInput = document.createElement("input");
    passInput.setAttribute("type", "password");
    passInput.classList.add("form-control");
    passInput.classList.add("botform");
    passInput.setAttribute("id", "uniqueform");
    passInput.setAttribute("name", "password");
    newForm.appendChild(passInput);
    const formBtn = document.createElement("button");
    formBtn.classList.add("btn");
    formBtn.classList.add("btn-primary");
    formBtn.innerText = "Log In";
    newForm.appendChild(formBtn);
    chatinterface.append(newForm);
    chatinterface.scrollTop = chatinterface.scrollHeight;
}

function secretLogout() {
    const newForm = document.createElement("form");
    newForm.setAttribute("action", "/logout");
    newForm.setAttribute("method", "POST");
    const formBtn = document.createElement("button");
    formBtn.classList.add("btn");
    formBtn.classList.add("btn-danger");
    formBtn.innerText = "Log Out";
    newForm.appendChild(formBtn);
    chatinterface.append(newForm);
    chatinterface.scrollTop = chatinterface.scrollHeight;
}
