import { getCookie } from "./util.js";
import { followFunc } from "./follow.js"

const renderPage = JSON.parse(localStorage.getItem("renderPage"));
const $post_owner_img = document.querySelector('.post_owner_img > img')
const $post_owner_nickname = document.querySelector('.post_owner_nickname')
const $post_owner_about = document.querySelector('.post_owner_about')
const $post_content_title = document.querySelector('.post_content h2')
const $post_content_content = document.querySelector('.post_content p')
const $post_img = document.querySelector('.post_img > img')
const $post_createdat = document.querySelector('.post_createdat p')
const $like_count = document.querySelector('.like_count')
const $comment_list = document.querySelector('.comment-list')
const $post_delete = document.querySelector('.post_delete > button')
const $post_edit = document.querySelector('.post_edit > button')
const $like_btn = document.querySelector('.like_icon')

// Django Server에서 Post Detail 가져온 후 DOM 생성
const postLoad = async () => {
    const url = `http://127.0.0.1:8000/post/view/${renderPage.pages}/`;

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => { 
            const comments = data.comments
            const like_users = data.likes
            if (data.writer.profileImage){
                $post_owner_img.src = 'http://127.0.0.1:8000/media/'+ data.writer.profileImage
            } else {
                $post_owner_img.src = '/src/assets/img/profile_temp.png'
            }
            $post_owner_nickname.innerText = data.writer.nickname
            $post_owner_about.innerText = data.writer.about
            $post_content_title.innerText = data.post.title
            $post_content_content.innerText = data.post.content
            if(data.post.postImage){
                $post_img.src = 'http://127.0.0.1:8000/media/' + data.post.postImage
            }
            const time = new Date(data.post.created_at)
            const year = time.getFullYear();
            const month = time.getMonth() +1;
            const date = time.getDate();
            const hours = time.getHours();
            const minutes = time.getMinutes();
            
            $post_createdat.innerText = `${year}년 ${month}월 ${date}일 ${hours}시 ${minutes}분 `
            $like_count.innerText = like_users.length

            comments.forEach(data => {
                if(data.comment.parent_comment_id) {
                    const parent_id = data.comment.parent_comment_id
                    const parent_comment = document.getElementById(parent_id)
                    const div = recommentRead(data)
                    parent_comment.append(div)
                } else {
                    const div = commentRead(data)
                    $comment_list.append(div)
                }
            });

            $post_delete.addEventListener('click',postDelete)
            $post_edit.addEventListener('click',() => postEdit(data.post))

            const $comment_write_btn = document.querySelector('.comment-write-btn')
            const $recomment_write_buttons = document.querySelectorAll('.recomment_write_button')
            const $comment_delete_buttons = document.querySelectorAll('.comment_delete')
            const $recomment_delete_buttons = document.querySelectorAll('.recomment_delete')
            const $follow_btn = document.querySelector('.post_owner_follow > button')

            $follow_btn.id = data.writer.id

            if (localStorage.getItem('user')) {
                const profile = JSON.parse(localStorage.getItem('user'))
                const follow_list = JSON.parse(localStorage.getItem('follow'))
                const $comment_writer_imgs = document.querySelectorAll('.comment_writer_img > img')

                if($follow_btn.id == profile.id) {
                    $follow_btn.remove()
                }

                $comment_write_btn.addEventListener('click',commentWrite)
                
                like_users.forEach(like_user => {
                    if (like_user.user_id == profile.id) {
                        $like_btn.classList = 'fa-solid fa-heart like_icon'
                    }
                });

                if($like_btn.classList.value.includes('fa-solid')) {
                    $like_btn.addEventListener('click',unlikeFunc)
                } else {
                    $like_btn.addEventListener('click',likeFunc)
                }

                $comment_delete_buttons.forEach(btn => {
                    if (btn.id == profile.id) {
                        btn.classList.toggle('hidden')
                    }
                    btn.addEventListener('click',commentDelete)
                });

                $recomment_delete_buttons.forEach(btn => {
                    if (btn.id == profile.id) {
                        btn.classList.toggle('hidden')
                    }
                    btn.addEventListener('click',recommentDelete)
                });

                $comment_writer_imgs.forEach(img => {
                    if (profile.profileImage) {
                        img.src = 'http://127.0.0.1:8000'+ profile.profileImage
                    } else {
                        img.src = '/src/assets/img/profile_temp.png'
                    }
                });
                
                $recomment_write_buttons.forEach(btn => {
                    btn.addEventListener('click',recommentWrite)
                });

                follow_list.forEach(follow => {
                    if (follow.target_id_id == $follow_btn.id) {
                        $follow_btn.innerText = 'Unfollow'
                    }
                });

                if(profile.id == data.writer.user_id){
                    const $post_edit = document.querySelector('.post_edit')
                    const $post_delete = document.querySelector('.post_delete')
                    $post_edit.classList.toggle('hidden')
                    $post_delete.classList.toggle('hidden')
                }

            } else {
                const $comment_replys = document.querySelectorAll('.comment-reply')

                $follow_btn.remove()
                $comment_write_btn.remove()
                $comment_replys.forEach(element => {
                    element.remove()
                });
            }

            const $reply_shows = document.querySelectorAll('.comment-reply > a')

            $reply_shows.forEach($reply_show => {
                $reply_show.addEventListener('click', replyShow)
            });

        })
        .catch((err) => {
            console.log(err);
        });
};

const postEdit = (post) => {
    localStorage.setItem('edit', JSON.stringify(post));
    location.href = '/src/view/edit.html'
}

// Post 삭제
const postDelete = async () => {
    const url = `http://127.0.0.1:8000/post/delete/${renderPage.pages}/`;
    const access = getCookie('access')
    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
    })
        .then((res) => res.json())
        .then((data) => {
            alert(data.message)
            location.href = '/src/view/board.html'
        })
        .catch((err) => {
            console.log(err);
        });
};

// Comment 작성
const commentWrite = async (event) => {
    const target = event.target
    const parent = target.parentNode
    const url = 'http://127.0.0.1:8000/post/comment/write/';
    
    const access = getCookie('access')
    const formData = new FormData();
    
    const $comment = parent.querySelector('input')
    const comment_content = $comment.value
    const post_id = renderPage.pages

    formData.append('post_id', post_id);
    formData.append('content', comment_content);

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

// Recomment 작성
const recommentWrite = async (event) => {
    
    let target = event.target

    while (target.classList != 'comment'){
        target = target.parentNode
    }

    const url = 'http://127.0.0.1:8000/post/re-comment/write/';
    const access = getCookie('access')
    const formData = new FormData();
    const $comment = target.querySelector('.recomment_write_input')
    const comment_content = $comment.value
    const post_id = renderPage.pages
    const comment_id = target.id

    formData.append('post_id', post_id);
    formData.append('content', comment_content);
    formData.append('comment_id', comment_id);

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

// Comment 그려주는 함수
const commentRead = (data) => {
    const comment = document.createElement('div')
    const comment_owner = document.createElement('div')
    const comment_owner_img_div = document.createElement('div')
    const comment_owner_img = document.createElement('img')
    const comment_owner_info = document.createElement('div')
    const comment_owner_info_p1 = document.createElement('p')
    const comment_owner_info_p2 = document.createElement('p')
    const comment_content = document.createElement('div')
    const comment_content_p = document.createElement('p')
    const comment_delete_button = document.createElement('button')
    const comment_delete_button_i = document.createElement('i')
    const comment_reply = document.createElement('div')
    const comment_reply_a = document.createElement('a')
    const comment_reply_a_p = document.createElement('p')
    const comment_reply_a_img = document.createElement('img')
    const comment_reply_write = document.createElement('div')
    const comment_writer_img_div = document.createElement('div')
    const comment_writer_img = document.createElement('img')
    const comment_reply_write_input = document.createElement('input')
    const comment_reply_write_button = document.createElement('button')

    comment.className = 'comment'
    comment.id = data.comment.id
    comment_owner.className = 'comment_owner'
    comment_owner_img_div.className = 'comment_owner_img'
    comment_owner_img_div.append(comment_owner_img)
    if (data.writer.profileImage) {
        comment_owner_img.src = 'http://127.0.0.1:8000/media/'+ data.writer.profileImage
    } else {
        comment_owner_img.src = '/src/assets/img/profile_temp.png'
    }
    comment_owner_info.className = 'comment_owner_info'
    comment_owner_info_p1.innerText = data.writer.nickname
    comment_owner_info_p2.innerText = data.writer.about

    comment_owner_info.append(comment_owner_info_p1,comment_owner_info_p2)
    comment_owner.append(comment_owner_img_div,comment_owner_info)

    if (data.comment.is_active){
        comment_content_p.innerText = data.comment.content
        comment_content.append(comment_content_p,comment_delete_button)
    } else {
        comment_content_p.innerText = '삭제된 댓글 입니다.'
        comment_content.append(comment_content_p)
    }

    comment_delete_button.id = data.writer.user_id
    comment_delete_button.className = 'comment_delete hidden'
    comment_delete_button_i.classList = 'fa-solid fa-trash-can'
    comment_delete_button.append(comment_delete_button_i)
    comment_content.className = 'comment_content'

    comment_reply.className = 'comment-reply'
    comment_reply_a.href = '#'
    comment_reply_a_img.src = '/src/assets/img/arrow.svg'
    comment_reply_a_p.innerText = '답글 남기기'
    comment_reply_a.append(comment_reply_a_img,comment_reply_a_p)

    comment_writer_img.src = '/src/assets/img/profile_temp.png'
    comment_writer_img_div.className = 'comment_writer_img'
    comment_writer_img_div.append(comment_writer_img)

    comment_reply_write_input.className = 'recomment_write_input'
    comment_reply_write_input.type = 'text'
    comment_reply_write_input.placeholder = '답글을 입력하세요.'
    comment_reply_write_button.className = 'recomment_write_button'
    comment_reply_write_button.innerText = '등록'

    comment_reply_write.classList = 're-comment-write hidden'
    comment_reply_write.append(comment_writer_img_div,comment_reply_write_input,comment_reply_write_button)

    comment_reply.append(comment_reply_a,comment_reply_write)

    comment.append(comment_owner,comment_content,comment_reply)
    return comment
}

const recommentRead = (data) => {
    const recomment = document.createElement('div')
    const comment_owner = document.createElement('div')
    const comment_owner_img_div = document.createElement('div')
    const comment_owner_img = document.createElement('img')
    const comment_owner_info = document.createElement('div')
    const comment_owner_info_p1 = document.createElement('p')
    const comment_owner_info_p2 = document.createElement('p')
    const comment_content = document.createElement('div')
    const comment_content_p = document.createElement('p')
    const comment_delete_button = document.createElement('button')
    const comment_delete_button_i = document.createElement('i')

    recomment.className = 're-comment'
    recomment.id = data.comment.id
    comment_owner.className = 'comment_owner'
    comment_owner_img_div.className = 'comment_owner_img'
    comment_owner_img_div.append(comment_owner_img)
    if (data.writer.profileImage) {
        comment_owner_img.src = 'http://127.0.0.1:8000/media/'+ data.writer.profileImage
    } else {
        comment_owner_img.src = '/src/assets/img/profile_temp.png'
    }
    comment_owner_info.className = 'comment_owner_info'
    comment_owner_info_p1.innerText = data.writer.nickname
    comment_owner_info_p2.innerText = data.writer.about

    comment_owner_info.append(comment_owner_info_p1,comment_owner_info_p2)
    comment_owner.append(comment_owner_img_div,comment_owner_info)

    if (data.comment.is_active){
        comment_content_p.innerText = data.comment.content
        comment_content.append(comment_content_p,comment_delete_button)
    } else {
        comment_content_p.innerText = '삭제된 댓글 입니다.'
        comment_content.append(comment_content_p)
    }

    comment_delete_button.id = data.writer.user_id
    comment_delete_button.className = 'recomment_delete hidden'
    comment_delete_button_i.classList = 'fa-solid fa-trash-can'
    comment_delete_button.append(comment_delete_button_i)
    comment_content.className = 'comment_content'

    recomment.append(comment_owner,comment_content)
    return recomment
}

// Comment 삭제
const commentDelete = async (event) => {
    let target = event.target

    while (target.classList != 'comment'){
        target = target.parentNode
    }

    const url = 'http://127.0.0.1:8000/post/comment/delete/';
    const formData = new FormData();
    const comment_id = target.id
    const access = getCookie('access')

    formData.append('comment_id', comment_id);

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

// Recomment 삭제
const recommentDelete = async (event) => {
    let target = event.target

    while (target.classList != 're-comment'){
        target = target.parentNode
    }

    const url = 'http://127.0.0.1:8000/post/comment/delete/';
    const formData = new FormData();
    const comment_id = target.id
    const access = getCookie('access')

    formData.append('comment_id', comment_id);

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

// Like 기능
const likeFunc = async () => {
    const url = `http://127.0.0.1:8000/post/like/`;
    
    const access = getCookie('access')
    const formData = new FormData();
    const post_id = renderPage.pages

    formData.append('post_id', post_id);

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            location.reload()
        })
        .catch((err) => {
            console.log(err);
        });
};

const unlikeFunc = async () => {
    const url = `http://127.0.0.1:8000/post/unlike/`;
    
    const access = getCookie('access')
    const formData = new FormData();
    const post_id = renderPage.pages

    formData.append('post_id', post_id);

    await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${access}`,
        },
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            location.reload()
        })
        .catch((err) => {
            console.log(err);
        });
};

const replyShow = (event) => {
    event.preventDefault()

    let target = event.target

    while (target.classList != 'comment-reply'){
        target = target.parentNode
    }
    
    const $reply_write = target.querySelector('.re-comment-write')
    $reply_write.classList.toggle('hidden')
}

is_logined()
postLoad()

