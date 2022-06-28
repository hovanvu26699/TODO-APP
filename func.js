// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCQmYi2Zk-APok469MF3h6JcCSgygqkXtU",
    authDomain: "todoapp-62a80.firebaseapp.com",
    projectId: "todoapp-62a80",
    storageBucket: "todoapp-62a80.appspot.com",
    messagingSenderId: "544393421128",
    appId: "1:544393421128:web:c6c7d12e322a87cc23937d",
    measurementId: "G-GRVQZ363NN"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

//// UPDATE FUNCTION
// create id function
function createIdContent() {
    let id = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return id() + id() + id() + id() + id() + id() + id() + id();
}

//// Update database
function addData(content, id) {
    db.collection("users").doc(localStorage.getItem('id')).update({
        items: firebase.firestore.FieldValue.arrayUnion({ 'content': content, 'id': id })
    }).then(function () {
        console.log("update successful");
    });
}
//// ADD FUNCTION
const inputItem = document.getElementById("txtInput");
function addItem() {
    if (inputItem.value.length == 0) return;
    ID = createIdContent()
    addData(inputItem.value, ID,);
    document.getElementById("list").innerHTML += `<div class='items'>
                                            <div>
                                            <input type='checkbox' name='' class='checkWork' id='${ID + ID}'>
                                            <label for='${ID + ID}' class='content'>${inputItem.value}</label>
                                            </div>
                                            <i class='fa-solid fa-xmark del' id='${ID}' onclick='deleteItem(this)'></i>
                                            </div>`
    inputItem.value = "";
}

//// DELETE FUNCTION
function deleteItem(item) {
    idItem = item.id;
    var x = document.getElementById(idItem).parentElement;
    x.remove()

    db.collection("users").get().then((doc) => {
        doc.forEach((user) => {
            if (user.id == localStorage.getItem('id')) {
                let items = user.data().items
                for (i = 0; i < items.length; i++) {
                    if (items[i].id === idItem) {
                        contentItem = items[i].content
                        db.collection("users").doc(localStorage.getItem('id')).update(
                            'items', firebase.firestore.FieldValue.arrayRemove({ 'id': idItem, 'content': contentItem })
                        )
                        break;
                    }
                }
            }
        })

    })
}

//// ENTER FUNCTION
inputItem.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        console.log(localStorage.getItem('id'))
        if (localStorage.getItem('id') == null) {
            alert('Please login to use app!')
        } else {
            addItem();
        }
    }
});

//// REDIRECT FUNCTION
function redirect(n) {
    localStorage.clear();
    window.location = n + ".html"
}

//// CREATE ACCOUNT
function createUser() {
    const userRef = db.collection("users")

    const name = document.getElementsByClassName('inpName')
    const userName = document.getElementById('txtUserSignup')
    const email = document.getElementById('emailSignup')
    const pwd = document.getElementById('pwdSignup')
    const confirmPwd = document.getElementById('confirmPwd')

    let alive = false
    if (pwd.value !== confirmPwd.value) {
        confirmPwd.autofocus
        alert("Password incorrect!")
        return
    }
    db.collection("users").get().then((doc) => {
        doc.forEach((user) => {
            if (email.value == user.data().email) {
                alive = true

            }
            console.log(user.data().email, email.value)
            console.log(alive)
        });
        if (!alive) {
            userRef.add({
                email: email.value,
                userName: userName.value,
                password: pwd.value,
                fullName: name[1].value + " " + name[0].value,
                items: []

            })
                .then((docRef) => {
                    alert('Create Account Success!')
                    console.log("Document written with ID: ", docRef.id);
                    redirect('login')
                })
        } else {
            alert('Account already exists!')
            pwd.value = ""
            confirmPwd.value = ""
        }
    })




}

//// LOGIN FUNCTION
function login() {
    localStorage.clear();
    const userName = document.getElementById('txtUser')
    const password = document.getElementById('txtPass')

    db.collection("users").get().then((doc) => {
        doc.forEach((user) => {
            if (userName.value == user.data().email && password.value == user.data().password) {
                userOnl = user.data()
                userId = user.id
                redirect('index')
            }
        });
        localStorage.setItem('id', userId);
        // if (localStorage.getItem('id') == nul) {
        //     alert("Incorrect password or account!")
        //     password.autofocus
        // }


    }).catch((error) => {
        console.log("Error getting document:", error);
        alert("Incorrect password or account!")
    });

}

//// LOAD DATA FROM FIREBASE
const userName = document.getElementsByClassName('userName-header')
const userHeader = document.getElementsByClassName('userHead')
const btnHeader = document.getElementsByClassName('btn-login-signup')
const listItem = document.getElementById("list")
function loadData(id) {
    listItem.innerHTML = "";

    db.collection("users").get().then((doc) => {
        doc.forEach((user) => {
            if (user.id == id) {
                item = user.data().items
                for (i = 0; i < item.length; i++) {
                    document.getElementById("list").innerHTML += `<div class='items'>
                                                                 <div>
                                                                 <input type='checkbox' name='' class='checkWork' id='${item[i].id + i}'>
                                                                 <label for='${item[i].id + i}' class='content'>${item[i].content}</label>
                                                                </div>
                                                                 <i class='fa-solid fa-xmark del' id='${item[i].id}'onclick='deleteItem(this)'></i>
                                                                </div>`
                }

                btnHeader[0].style.display = 'none'
                userHeader[0].style.display = 'flex'
                userName[0].innerHTML = user.data().userName

                console.log(user.data().userName)
            }
        })
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}
loadData(localStorage.getItem('id'))

//// LOG OUT
const drop = document.getElementsByClassName('drop')
const contentDrop = document.getElementsByClassName('dropdown-content')

drop[0].addEventListener('click', () => {
    contentDrop[0].style.display = 'flex'
})

contentDrop[0].addEventListener('click', () => {
    btnHeader[0].style.display = 'flex'
    userHeader[0].style.display = 'none'
    listItem.innerHTML = "";
    localStorage.clear();
    console.log("Đăng xuất thành công")
})