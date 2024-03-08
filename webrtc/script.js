let socket = new WebSocket("ws://192.168.68.103:8080/");
const outputDiv = document.getElementById("container");
const messageField = document.getElementById("messageField");
let chatroomUid = null;

socket.onopen = function (e) {
    alert("[open] Connection established");
    chatroomUid = prompt("Enter Chat room Uid : ");
    const username = prompt("Enter your username : ");

    if (chatroomUid && username)
        socket.send(JSON.stringify({ event: 'chatroomconnect', message: chatroomUid, username }))
};

socket.onmessage = function (event) {
    const mssgDiv = document.createElement("h2");
    mssgDiv.textContent = event.data;
    mssgDiv.style.color = "green";

    outputDiv.append(mssgDiv);
};

const sendMessage = (e) => {
    e.preventDefault();

    const mssgDiv = document.createElement("h2");
    mssgDiv.textContent = messageField.value;
    mssgDiv.style.color = "red";


    outputDiv.append(mssgDiv);

    socket.send(JSON.stringify({ event: 'message', uid: chatroomUid, message: messageField.value }));
    messageField.value = "";
}

socket.onclose = function (event) {
    if (event.wasClean) {
        alert(`[close] Connection closed`);
    } else {
        alert('[close] Connection died');
    }
};

socket.onerror = function (error) {
    alert(`[error] Disconnected`);
};