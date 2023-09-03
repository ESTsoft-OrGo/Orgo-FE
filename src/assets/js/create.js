import { getCookie } from "./util.js";

const $title = document.querySelector('#title')
const $description = document.querySelector('#content')
const $start_date = document.querySelector('#start_date')
const $end_date = document.querySelector('#end_date')
const $online_offline = document.querySelector('#division')
const $location = document.querySelector('#location')
const $max_participants = document.querySelector('#max')
const $status = document.querySelector('#status')
const $tags = document.querySelector('#tag')
const $create_btn = document.querySelector('.study_create > button')

// Study 작성
const studyCreate = async () => {
    
    const url = 'https://api.withorgo.site/study/create/';
    const access = getCookie('access')
    const formData = new FormData();

    formData.append('title', $title.value);
    formData.append('description', $description.value);
    formData.append('start_date', $start_date.value);
    formData.append('end_date', $end_date.value);
    formData.append('online_offline', $online_offline.value);
    formData.append('location', $location.value);
    formData.append('max_participants', $max_participants.value);
    formData.append('status', $status.value);
    formData.append('tags', $tags.value);

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            alert(data.message)
            location.href = '/src/view/study.html'
        })
        .catch((err) => {
            alert(err)
            location.href = '/src/view/study.html'
        });
};

$create_btn.addEventListener('click',studyCreate)