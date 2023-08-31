import { getCookie, getWithExpire,slide_func } from "./util.js";
import { followFunc } from "./follow.js"

const studyPage = JSON.parse(localStorage.getItem("studyPage"));
const user = getWithExpire('user');
const user_profile = JSON.parse(user)
const $study_title = document.querySelector('.study_title')
const $study_leader_img = document.querySelector('.study_leader > img')
const $study_leader_name = document.querySelector('.study_leader > p')
const $study_createdAt = document.querySelector('.study_createdAt')
const $study_proceed = document.querySelector('.study_proceed')
const $study_date = document.querySelector('.study_date')
const $study_participants = document.querySelector('.study_participants')
const $study_location = document.querySelector('.study_location')
const $study_status = document.querySelector('.study_status')
const $study_tags = document.querySelector('.study_tags')
const $study_desc = document.querySelector('.study_desc')
const $study_join = document.querySelector('.study_join')
const $study_cancle = document.querySelector('.study_cancle')
const $study_edit = document.querySelector('.study_edit')
const $study_delete = document.querySelector('.study_delete')

const studyLoad = async () => {
    const url = `http://127.0.0.1:8000/study/detail/`;
    const formData = new FormData();
    formData.append('study_id', studyPage.pages);

    await fetch(url, {
        method: "POST",
        headers: {
        },
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            $study_title.innerText = data.study.title
            $study_leader_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ data.leader.profileImage
            $study_leader_name.innerText = data.leader.nickname

            const time = new Date(data.study.created_at)
            const year = time.getFullYear();
            const month = time.getMonth() +1;
            const date = time.getDate();

            const startDate = data.study.start_date.split("T")[0];
            const endDate = data.study.end_date.split("T")[0];

            $study_edit.addEventListener('click',() => studyEdit(data.study,data.tags))
            $study_delete.addEventListener('click',studyDelete)

            if(user_profile.id != data.leader.id) {
                $study_edit.remove()
                $study_delete.remove()
            }

            $study_createdAt.innerText = `${year}년 ${month}월 ${date}일`

            if(data.study.online_offline == "OFF"){
                $study_proceed.innerText = "오프라인"
            } else {
                $study_proceed.innerText = "온라인"
            }

            

            $study_date.innerText = `${startDate} ~ ${endDate}`
            $study_participants.innerText = `${data.study.participants.length} / ${data.study.max_participants}`
            $study_location.innerText = data.study.location
            $study_status.innerText = data.study.status
            $study_desc.innerText = data.study.description
            const tags = data.tags
            tags.forEach(tag => {
                const tag_div = create_tag(tag)
                $study_tags.append(tag_div)
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

const create_tag = (data) => {
    const div = document.createElement('div')
    div.innerHTML = `<p class="study_tag" id="${data.id}">${data.name}</p>`
    return div
}

const studyEdit = (post,tags) => {
    localStorage.setItem('studyEdit', JSON.stringify(post));
    localStorage.setItem('studyTags', JSON.stringify(tags));
    location.href = '/src/view/studyEdit.html'
}

// Post 삭제
const studyDelete = async () => {
    const url = `http://127.0.0.1:8000/study/delete/`;
    const access = getCookie('access')
    const formData = new FormData();
    formData.append('study_id', studyPage.pages);

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
            console.log(err);
        });
};

// stduy 조인
const studyJoin = async () => {
    const url = `http://127.0.0.1:8000/study/join/`;
    const access = getCookie('access')
    const formData = new FormData();
    formData.append('study_id', studyPage.pages);
    
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
            location.reload()
        })
        .catch((err) => {
            console.log(err);
        });
};

// stduy 조인
const studyCancle = async () => {
    const url = `http://127.0.0.1:8000/study/join/cancel/`;
    const access = getCookie('access')
    const formData = new FormData();
    formData.append('study_id', studyPage.pages);
    
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
            location.reload()
        })
        .catch((err) => {
            console.log(err);
        });
};

studyLoad()
$study_join.addEventListener('click',studyJoin)
$study_cancle.addEventListener('click',studyCancle)