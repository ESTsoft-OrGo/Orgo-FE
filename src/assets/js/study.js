import { study_page } from "./util.js"
import { create_study } from "./createElement.js"

const $study_list = document.querySelector('.study_list')
const page = localStorage.getItem('pageNumber')
const $loading = document.querySelector('.loading')

const study_list = async () => {

    let url;

    if(page) {
        url = `http://127.0.0.1:8000/study/?page=${page}`
    } else {
        url = 'http://127.0.0.1:8000/study/?page=1'
    }

    await fetch(url, {
        method: "GET",
        headers: {},
    })

    .then((res) => res.json())
    .then((data) => {
        if(data){
            if(data.detail){
                alert(data.detail)
                location.href = "/index.html"
            } else {
                const $studyPagination = document.querySelector('.studyPagination')
                const studies = data.studies
                const studies_all = data.studies_all
                studies.forEach(element => {
                    const study = create_study(element)
                    $study_list.append(study)
                });
    
                const $study_div = document.querySelectorAll('.study_div')
    
                $study_div.forEach(element => {
                    element.addEventListener('click',study_page)
                });

                const pages = Math.ceil(studies_all/12)
                $studyPagination.innerHTML = ""
                for (var i = 1; i <= pages; i++) { // 배열 arr의 모든 요소의 인덱스(index)를 출력함.
                    const btn = document.createElement('button')
                    btn.innerText = i
                    btn.addEventListener('click',pageNumber)
                    $studyPagination.append(btn)
                }
            }
            localStorage.removeItem('pageNumber')
            $loading.style.display = "none"
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

const pageNumber = (event) => {
    const target = event.target
    const page = target.innerText
    localStorage.setItem('pageNumber',page)
    location.href = `/src/view/study.html?page=${page}`
}

study_list()