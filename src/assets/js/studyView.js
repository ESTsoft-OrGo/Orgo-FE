import { getCookie, getWithExpire, profile } from "./util.js";
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
const $study_in_people = document.querySelector('.study_in_people')
const $study_desc = document.querySelector('.study_desc')
const $study_join = document.querySelector('.study_join')
const $study_cancle = document.querySelector('.study_cancle')
const $study_edit = document.querySelector('.study_edit')
const $study_delete = document.querySelector('.study_delete')
const $study_attend_btns = document.querySelector('.study_attend_btns')
const $loading = document.querySelector('.loading')

const studyLoad = async () => {
    const url = `https://api.withorgo.site/study/detail/`;
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
            if(data.leader.profileImage) {
                $study_leader_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ data.leader.profileImage
            } else {
                $study_leader_img.src = '/src/assets/img/profile_temp.png'
            }
            $study_leader_name.innerText = data.leader.nickname

            const time = new Date(data.study.created_at)
            const year = time.getFullYear();
            const month = time.getMonth() +1;
            const date = time.getDate();
            const startDate = data.study.start_date.split("T")[0];
            const endDate = data.study.end_date.split("T")[0];

            $study_edit.addEventListener('click',() => studyEdit(data.study,data.tags))
            $study_delete.addEventListener('click',studyDelete)
            
            if(!user) {
                $study_edit.remove()
                $study_delete.remove()
                $study_attend_btns.remove()
            } else {
                if(user_profile.id != data.leader.id) {
                    $study_edit.remove()
                    $study_delete.remove()
                } else {
                    $study_attend_btns.remove()
                }
            }

            if(data.study.status == "종료"){
                $study_attend_btns.remove()
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

            const participants = data.participants
            participants.forEach(participant => {
                const participant_div = create_participant(participant)
                $study_in_people.append(participant_div)
            });

            const follow_list = JSON.parse(localStorage.getItem('follow'))
            const $follow_btn_divs = document.querySelectorAll('.follow_btn_div > button')
        
            $follow_btn_divs.forEach(btn => {
                btn.addEventListener('click',(event) => followFunc(event,'view'))
 
                if(!user){
                    btn.remove()
                } else {
                    if (btn.id == user_profile.id) {
                        btn.remove()
                    }
                }
                if(follow_list) {
                    follow_list.forEach(follow => {
                        if (follow.target_id_id == btn.id) {
                            btn.innerText = 'Unfollow'
                        }
                    });
                }
            });
            profile()
            $loading.remove()
        })
        .catch((err) => {
            console.log(err);
        });
};

const create_participant = (data) => {

    const div = document.createElement('div')
    let pf_img;
    if(data.profileImage) {
        pf_img = `https://myorgobucket.s3.ap-northeast-2.amazonaws.com${data.profileImage}`
    } else {
        pf_img = '/src/assets/img/profile_temp.png'
    }

    div.className = 'participant'
    div.innerHTML = `
    <div class="participant_img">
        <img src="${pf_img}">
    </div>
    <div class="participant_info">
        <a id="${data.id}" class="userprofile" href="profile.html">${data.nickname}</a>
        <p>${data.about}</p>
    </div>
    <div class="follow_btn_div">
        <button id="${data.id}">Follow</button>
    </div>`

    return div
}

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
    const url = `https://api.withorgo.site/study/delete/`;
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
    const url = `https://api.withorgo.site/study/join/`;
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
    const url = `https://api.withorgo.site/study/join/cancel/`;
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