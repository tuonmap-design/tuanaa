let users = JSON.parse(localStorage.getItem("users") || "{}");
let currentUser = null;

function save() {
  localStorage.setItem("users", JSON.stringify(users));
}

function showRegister() {
  login.style.display = "none";
  register.style.display = "block";
}

function showLogin() {
  register.style.display = "none";
  login.style.display = "block";
}

function register() {
  let u = regUser.value;
  let p = regPass.value;

  if (!u || !p) {
    regMsg.innerText = "Nhập đủ thông tin";
    return;
  }

  if (users[u]) {
    regMsg.innerText = "Tên đã tồn tại";
    return;
  }

  users[u] = { password: p, messages: {} };
  save();
  alert("Đăng ký thành công");
  showLogin();
}

function login() {
  let u = loginUser.value;
  let p = loginPass.value;

  if (!users[u] || users[u].password !== p) {
    loginMsg.innerText = "Sai tài khoản";
    return;
  }

  currentUser = u;
  login.style.display = "none";
  chat.style.display = "block";
  currentUser.innerText = "Xin chào: " + u;

  loadUsers();
}

function loadUsers() {
  toUser.innerHTML = "";
  Object.keys(users).forEach(u => {
    if (u !== currentUser) {
      let opt = document.createElement("option");
      opt.value = u;
      opt.text = u;
      toUser.appendChild(opt);
    }
  });
}

function send() {
  let to = toUser.value;
  let text = msg.value;
  if (!text) return;

  users[currentUser].messages[to] ??= [];
  users[to].messages[currentUser] ??= [];

  users[currentUser].messages[to].push({ from: currentUser, text });
  users[to].messages[currentUser].push({ from: currentUser, text });

  save();
  msg.value = "";
  loadChat();
}

function loadChat() {
  let to = toUser.value;
  chatBox.innerHTML = "";

  let msgs = users[currentUser].messages[to] || [];
  msgs.forEach(m => {
    let div = document.createElement("div");
    div.className = m.from === currentUser ? "me" : "other";
    div.innerText = m.from + ": " + m.text;
    chatBox.appendChild(div);
  });
}

function addEmoji(e) {
  msg.value += e;
}

function logout() {
  location.reload();
}
