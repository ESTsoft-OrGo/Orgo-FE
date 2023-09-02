import { getCookie } from "./util.js"
// 팔로우
export const followFunc = async(event,where) => {

    const target = event.target
    const target_id = target.id

    if(target.innerText.toUpperCase() == "UNFOLLOW") {
        target.innerText = "Follow"
    }else {
        target.innerText = "Unfollow"
    }

    const access = getCookie('access')
    const formData = new FormData();

    formData.append('you', target_id);

    const url = 'http://127.0.0.1:8000/user/follow/'

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
            alert(data.message)
            if(data.new_following) {
                localStorage.setItem('follow', JSON.stringify(data.new_following));
            } else {
                localStorage.setItem('follow', JSON.stringify({}));
            }
            if(where != "view"){
                location.reload()
            }
        }
    })
    .catch((err) => {
        console.log(err);
    });
}