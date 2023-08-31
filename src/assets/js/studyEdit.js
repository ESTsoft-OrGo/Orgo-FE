import { getCookie } from "./util.js";

const studyData = JSON.parse(localStorage.getItem("studyEdit"));
const tagsData = JSON.parse(localStorage.getItem("studyTags"));
const studyID = studyData.id
const $title = document.querySelector('#title')
const $description = document.querySelector('#content')
const $start_date = document.querySelector('#start_date')
const $end_date = document.querySelector('#end_date')
const $online_offline = document.querySelector('#division')
const $location = document.querySelector('#location')
const $max_participants = document.querySelector('#max')
const $status = document.querySelector('#status')
const $save_btn = document.querySelector('.study_save > button')
const $tag_add = document.querySelector('.tag_add')
const $tag_list = document.querySelector('.tag_list')

const setEdit = () => {
    $title.value = studyData.title
    $description.value = studyData.description

    const startDate = studyData.start_date.split("T")[0];
    const endDate = studyData.end_date.split("T")[0];

    $start_date.value = startDate
    $end_date.value = endDate
    $online_offline.value = studyData.online_offline
    $location.value = studyData.location
    $max_participants.value = studyData.max_participants
    $status.value = studyData.status
    $max_participants.value = studyData.max_participants

    tagsData.forEach((data)=> {
        const usually_tag = createUsuallyTag(data)
        $tag_list.append(usually_tag)
        const tag_del_btn = usually_tag.querySelector('.tag_del_btn')
        tag_del_btn.addEventListener('click',tagDelete)
    })

    const $usually_tags = document.querySelectorAll('.usually_tag > input')

    $usually_tags.forEach((usually_tag)=>{
        usually_tag.style.width = 0
        usually_tag.style.width = usually_tag.scrollWidth - 10 + 'px';
    })

    localStorage.removeItem('studyEdit');
};

// Study 작성
const studyEdit = async () => {
    
    const url = 'http://127.0.0.1:8000/study/edit/';
    const access = getCookie('access')
    const formData = new FormData();

    formData.append('study_id', studyID);
    formData.append('title', $title.value);
    formData.append('description', $description.value);
    formData.append('start_date', $start_date.value);
    formData.append('end_date', $end_date.value);
    formData.append('online_offline', $online_offline.value);
    formData.append('location', $location.value);
    formData.append('max_participants', $max_participants.value);
    formData.append('status', $status.value);

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
        alert(data.errors)
        location.href = '/src/view/study.html'
    });
};

const createUsuallyTag = (data) => {
    const tag = document.createElement('div')
    tag.className = "usually_tag"
    tag.innerHTML = `
    <input type="text" disabled value="${data.name}">
    <button class="tag_del_btn" id="${data.id}">
        <i class="fa-solid fa-x"></i>
    </button>
    `
    return tag
};

const createNewTag = () => {
    const new_tag = document.createElement('div')
    new_tag.className = 'new_tag'
    new_tag.innerHTML = `
    <input type="text" value="tag">
    <button class="tag_add_btn">
        <i class="fa-solid fa-check"></i>
    </button>
    `
    const new_tag_btn = new_tag.querySelector('.tag_add_btn')
    const new_tag_input = new_tag.querySelector('input')
    new_tag_input.addEventListener('input',tagWidth)
    new_tag_btn.addEventListener('click',tagSave)
    $tag_list.append(new_tag)
}

const tagSave = async(event) => {
    let target = event.target
    while (target.classList != 'new_tag'){
        target = target.parentNode
    }
    const input = target.querySelector('input')
    const btn = target.querySelector('button')
    const icon = target.querySelector('button > i')
    const url = 'http://127.0.0.1:8000/study/tag/add/';
    const access = getCookie('access')
    const formData = new FormData();
    formData.append('name', input.value);
    formData.append('study_id', studyID);

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
        target.classList = 'usually_tag'
        input.disabled = true
        btn.classList = "tag_del_btn"
        icon.classList = "fa-solid fa-x"
        btn.removeEventListener('click',tagSave)
        btn.addEventListener('click',tagDelete)

    })
    .catch((err) => {
        alert(data.errors)
        location.href = '/src/view/study.html'
    });
}

const tagWidth = (event) => {
    const target = event.target
    target.style.width = 0
    target.style.width = target.scrollWidth - 10 + 'px';
}

const tagDelete = async(event) => {
    let target = event.target
    while (target.classList != 'tag_del_btn'){
        target = target.parentNode
    }
    const url = 'http://127.0.0.1:8000/study/tag/delete/';
    const access = getCookie('access')
    const formData = new FormData();
    formData.append('tag_id', target.id);

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
        const del_div = target.parentNode
        del_div.remove()
    })
    .catch((err) => {
        alert(data.errors)
        location.href = '/src/view/study.html'
    });
}

setEdit()
$tag_add.addEventListener('click',createNewTag)
$save_btn.addEventListener('click',studyEdit)