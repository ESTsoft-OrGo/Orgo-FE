import {setCookie, is_logined, setWithExpire} from "./util.js"

const $login_btn = document.querySelector('.login_btn')
const $google_btn = document.querySelector('.google_btn')
const $github_btn = document.querySelector('.github_btn')

const email_login = async (event) => {
    event.preventDefault()
    
    const email = document.querySelector('.user-login__email').value
    const password = document.querySelector('.user-login__password').value

    const formData = new FormData();

    formData.append('email', email);
    formData.append('password', password);

    const url = 'http://127.0.0.1:8000/user/login/email/'

    await fetch(url, {
        method: "POST",
        headers: {},
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.token){
            setCookie('access',data.token.access)
            setCookie('refresh',data.token.refresh)
            localStorage.setItem('follow', JSON.stringify(data.follower));
            localStorage.setItem('myNotify', JSON.stringify(data.notify));
            setWithExpire('user',data.user_info)
            location.href= '/index.html'
        } else {
            alert(data.message)
        }
    })
    .catch((err) => {
        console.log(err);
    });
}
const google_login = async(event) => {
    event.preventDefault()

    const url = 'http://127.0.0.1:8000/user/login/google/'

    await fetch(url, {
        method: "POST",
        headers: {},
    })
    .then((res) => res.json())
    .then((data) => {
        if (data) {
            localStorage.setItem('method', JSON.stringify({"method":"google"}));
            location.href = data.url
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

const google_login_callback = async() => {
    const urlParams = new URL(location.href).searchParams;
    const code = urlParams.get('code');
    const url = 'http://127.0.0.1:8000/user/login/google/callback/'

    if(code) {

        const formData = new FormData();
        formData.append('code', code);

        await fetch(url, {
            method: "POST",
            headers: {             
            },
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.token){
                localStorage.removeItem('method')
                setCookie('access',data.token.access)
                setCookie('refresh',data.token.refresh)
                localStorage.setItem('follow', JSON.stringify(data.follower));
                localStorage.setItem('myNotify', JSON.stringify(data.notify));
                setWithExpire('user',data.user_info)
                location.href= '/index.html'
            } else {
                alert(data.message)
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
}


const github_login = async (event) => {
    event.preventDefault()

    const url = 'http://127.0.0.1:8000/user/login/github/'

    await fetch(url, {
        method: "POST",
        headers: {},
    })
    .then((res) => res.json())
    .then((data) => {
        if (data) {
            localStorage.setItem('method', JSON.stringify({"method":"github"}));
            location.href = data.url
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

const github_login_callback = async() => {
    const urlParams = new URL(location.href).searchParams;
    const code = urlParams.get('code');
    const url = 'http://127.0.0.1:8000/user/login/github/callback/'

    if(code) {

        const formData = new FormData();
        formData.append('code', code);

        await fetch(url, {
            method: "POST",
            headers: {             
            },
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.token){
                localStorage.removeItem('method')
                setCookie('access',data.token.access)
                setCookie('refresh',data.token.refresh)
                localStorage.setItem('follow', JSON.stringify(data.follower));
                localStorage.setItem('myNotify', JSON.stringify(data.notify));
                setWithExpire('user',data.user_info)
                location.href= '/index.html'
            } else {
                alert(data.message)
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
}

const home_link = () => {
    location.href= '/index.html'
}

is_logined()


const method = JSON.parse(localStorage.getItem("method"));
if(method){
    console.log(method.method)
    if(method.method == "github"){
        github_login_callback()
    } else {
        google_login_callback()
    }
}

$login_btn.addEventListener('click',email_login)
$google_btn.addEventListener('click',google_login)
$github_btn.addEventListener('click',github_login)