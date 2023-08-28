import {getCookie} from "./util.js"

const $change_btn = document.querySelector('.change_btn')

const password_change = async (event) => {
    event.preventDefault()
    
    const access = getCookie('access')
    const url = 'http://127.0.0.1:8000/user/profile/change-password/'

    const cur_password = document.querySelector('.current_password').value
    const new_password = document.querySelector('.new_password').value
    const new_password_valid = document.querySelector('.new_password_valid').value
    
    if ( new_password != new_password_valid){
        alert("비밀번호가 다릅니다.")
        return false
    }

    if (new_password.length <= 8){
        alert("비밀번호가 너무 짧습니다. 최소 8자 이상")
        return false
    }

    const formData = new FormData();
    
    formData.append('current_password', cur_password);
    formData.append('new_password', new_password);

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.message){
            if(data.message.includes('일치')){
                alert(data.message)
            } else{
                alert(data.message)
                location.href = '/index.html'
            }
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

$change_btn.addEventListener('click',password_change)