export const create_post = (post,owner,where,likes) => {
    const post_div = document.createElement('div');
    const post_owner = document.createElement('div');
    const post_owner_div = document.createElement('div');
    const post_owner_img = document.createElement('img');
    const post_owner_info = document.createElement('div');
    const post_owner_info_p1 = document.createElement('a');
    const post_owner_info_p2 = document.createElement('p');
    const post_owner_follow = document.createElement('div');
    const post_owner_follow_btn = document.createElement('button');
    const post_content = document.createElement('a');
    const post_title = document.createElement('p');
    const post_contents = document.createElement('p');
    const post_img_div = document.createElement('div');
    const post_img_box = document.createElement('div');
    const post_createdat_div = document.createElement('div');
    const post_createdat = document.createElement('p');
    const post_reaction_info = document.createElement('div');
    const reaction_info_div1 = document.createElement('div');
    const reaction_info_div1_p1 = document.createElement('p');
    const reaction_info_div1_p2 = document.createElement('p');
    const reaction_info_div1_p3 = document.createElement('p');
    const reaction_info_div1_p4 = document.createElement('p');
    const reaction_info_div2 = document.createElement('div');
    const reaction_info_div2_p1 = document.createElement('p');
    const reaction_info_div2_p2 = document.createElement('p');
    
    const profileUrl = '/src/view/profile.html'
    post_div.className = 'post'
    post_owner.className = 'post_owner';
    post_owner_div.className = 'post_owner_img'
    if (owner.profileImage){
        let profile_url;
        profile_url = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'
        post_owner_img.src = profile_url + owner.profileImage
    } else {
        post_owner_img.src = '/src/assets/img/profile_temp.png'
    }
    post_owner_info.className = 'post_owner_info'
    post_owner_info_p1.innerText = owner.nickname
    post_owner_info_p1.className = 'userprofile'
    post_owner_info_p1.id = owner.id
    post_owner_info_p1.href = profileUrl
    post_owner_info_p2.innerText = owner.about

    post_owner_follow.className = 'follow_btn_div'
    post_owner_follow_btn.id = owner.id
    post_owner_follow_btn.innerText = 'Follow'

    post_owner.append(post_owner_div,post_owner_info,post_owner_follow)
    post_owner_div.append(post_owner_img)
    post_owner_info.append(post_owner_info_p1,post_owner_info_p2)
    post_owner_follow.append(post_owner_follow_btn)

    post_content.className = 'post_content'
    post_content.id = post.id
    post_content.href = '/src/view/view.html'
    post_title.className = 'post_title'
    post_title.innerText = post.title
    post_contents.innerText = post.content

    post_content.append(post_title,post_contents)

    post_img_div.className = 'post_img'
    post_img_box.classList = 'post_img_box'

    let media_url
    if(post.images.length > 0){
        const images = post.images
        let n = 0
        for (const image of images) {
            n = n + 1
            const post_img = document.createElement('img');
            media_url = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com';
            if(n > 1){
                post_img.classList = 'hidden'
            }
            post_img.src = media_url + image.image
            post_img_box.append(post_img)
        }
        const next_btn = document.createElement('button')
        const next_icon = document.createElement('i')
        const prev_btn = document.createElement('button')
        const prev_icon = document.createElement('i')
        next_btn.classList = 'img_next'
        next_icon.classList = 'fa-solid fa-chevron-right'
        next_btn.append(next_icon)
        
        prev_btn.classList = 'img_prev'
        prev_icon.classList = 'fa-solid fa-chevron-left'
        prev_btn.append(prev_icon)

        post_img_div.append(post_img_box,prev_btn,next_btn)
    }

    post_createdat_div.className = 'post_createdat'
    
    const time = new Date(post.created_at)
    const year = time.getFullYear();
    const month = time.getMonth() +1;
    const date = time.getDate();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    
    post_createdat.innerText = `${year}년 ${month}월 ${date}일 ${hours}시 ${minutes}분 `
    post_createdat_div.append(post_createdat)

    post_reaction_info.className = 'post_reaction_info'
    reaction_info_div1.className = 'reaction_info_div'
    reaction_info_div1_p1.innerText = '좋아요'
    reaction_info_div1_p2.className = 'like_count'
    reaction_info_div1_p2.innerText = likes
    reaction_info_div1_p3.innerText = '댓글'
    reaction_info_div1_p4.className = 'comments_count'
    reaction_info_div1_p4.innerText = post.commnet_count
    reaction_info_div2.className = 'reaction_info_div'
    reaction_info_div2_p1.innerText = '조회'
    reaction_info_div2_p2.className = 'view_count'
    reaction_info_div2_p2.innerText = post.views
    reaction_info_div1.append(reaction_info_div1_p1,reaction_info_div1_p2,reaction_info_div1_p3,reaction_info_div1_p4)
    reaction_info_div2.append(reaction_info_div2_p1,reaction_info_div2_p2)
    post_reaction_info.append(reaction_info_div1,reaction_info_div2)

    post_div.append(post_owner,post_content,post_img_div,post_createdat_div,post_reaction_info);

    return post_div
}

export const create_follow = (data,type) => {
    const follow = document.createElement('div')
    const follow_img_div = document.createElement('div')
    const follow_img = document.createElement('img')
    const follow_info = document.createElement('div')
    const follow_info_a = document.createElement('a')
    const follow_info_p = document.createElement('p')
    const follow_btn_div = document.createElement('div')
    const follow_btn = document.createElement('button')
    follow_info_a.id = data.id
    follow_info_a.className = 'userprofile'
    follow_info_a.href = 'profile.html'
    follow.className = 'follow'
    follow_img_div.className = 'follow_img'

    if (data.profileImage){
        follow_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ data.profileImage
    } else {
        follow_img.src = '/src/assets/img/profile_temp.png'
    }
    
    follow_img_div.append(follow_img)

    follow_info.className = 'follow_info'
    follow_info_a.innerText = data.nickname
    follow_info_p.innerText = data.about
    follow_info.append(follow_info_a,follow_info_p)

    if (type == 'Chat'){
        follow_btn_div.className = 'followChat'
        follow_btn.innerText = type
    } else {
        follow_btn_div.className = 'follow_btn_div'
        follow_btn.innerText = 'Follow'
    }

    follow_btn.id = data.id
    follow_btn_div.append(follow_btn)

    follow.append(follow_img_div,follow_info,follow_btn_div)

    return follow
}

export const create_blackuser = (data) => {
    const blackuser = document.createElement('div')
    const blackuser_img_div = document.createElement('div')
    const blackuser_img = document.createElement('img')
    const blackuser_info = document.createElement('div')
    const blackuser_info_p1 = document.createElement('p')
    const blackuser_info_p2 = document.createElement('p')
    const blackuser_btn_div = document.createElement('div')
    const blackuser_btn = document.createElement('button')

    blackuser.className = 'blackuser'
    blackuser_img_div.className = 'blackuser_img'

    if (data.profileImage){
        blackuser_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ data.profileImage
    } else {
        blackuser_img.src = '/src/assets/img/profile_temp.png'
    }
    
    blackuser_img_div.append(blackuser_img)

    blackuser_info.className = 'blackuser_info'
    blackuser_info_p1.innerText = data.nickname
    blackuser_info_p2.innerText = data.about
    blackuser_info.append(blackuser_info_p1,blackuser_info_p2)

    blackuser_btn_div.className = 'blackuser_btn_div'
    blackuser_btn.innerText = 'Unblock'

    blackuser_btn.id = data.id
    blackuser_btn_div.append(blackuser_btn)

    blackuser.append(blackuser_img_div,blackuser_info,blackuser_btn_div)

    return blackuser
}

export const create_notify = (data) => {
    const notify = document.createElement('div')
    const sender_img_div = document.createElement('div')
    const sender_img = document.createElement('img')
    const sender_info = document.createElement('div')
    const sender_info_p = document.createElement('p')
    const accept_div = document.createElement('div')
    const accept_btn = document.createElement('button')

    notify.className = 'notify'
    sender_img_div.className = 'sender_img'

    if (data.sender.profileImage){
        sender_img.src = 'https://myorgobucket.s3.ap-northeast-2.amazonaws.com'+ data.sender.profileImage
    } else {
        sender_img.src = '/src/assets/img/profile_temp.png'
    }
    
    sender_img_div.append(sender_img)

    sender_info.className = 'sender_info'
    sender_info_p.innerText = `${data.sender.nickname}님이 ${data.notify.content}`
    sender_info.append(sender_info_p)
    
    accept_div.className = 'accept_div'
    accept_btn.innerText = '읽음'
    accept_btn.id = data.notify.id

    
    accept_div.append(accept_btn)

    notify.append(sender_img_div,sender_info,accept_div)

    return notify
}

export const create_study = (data) => {

    const study = document.createElement('a')
    // 태그 추가
    let tags = '';
    for (const tag of data.tags) {
        const tag_html = `<div class="study_tag">${tag.name}</div>`
        tags += tag_html
    }

    // 온 오프라인 구분
    let division;
    if (data.study.online_offline == "ON"){
        division = `<p class="study_division">💻 Online</p>`
    } else {
        division = `<p class="study_division">🏙️ Offline</p>`
    }
    // 상태 구분
    let status;
    if(data.study.status == "진행중"){
        status = `<p class="study_Proceeding">진행중</p>`
    } else if (data.study.status == "종료") {
        status = `<p class="study_deadline">종료</p>`
    } else {
        status = `<p class="study_recruiting">모집중</p>`
    }
    
    const startDate = data.study.start_date.split("T")[0];
    const endDate = data.study.end_date.split("T")[0];

    let leader_img;

    if(data.leader.profileImage){
        leader_img = `https://myorgobucket.s3.ap-northeast-2.amazonaws.com${data.leader.profileImage}`
    } else {
        leader_img = '/src/assets/img/profile_temp.png'
    }

    study.className = 'study_div'
    study.id = data.study.id
    study.href = '/src/view/studyView.html'
    
    study.innerHTML = `
        <div class="study_status">
            ${division}
            ${status}
        </div>
        <div class="study_title">
            <p>${data.study.title}</p>
        </div>
        <div class="study_schedule">
            <p>모임 기간 |</p>
            <p>${startDate}</p>
            <p>~</p>
            <p>${endDate}</p>
        </div>
        <div class="study_location">
            <p>모임 장소 |</p>
            <p>${data.study.location}</p>
        </div>
        <div class="study_participants">
            <p>참여 인원 |</p>
            <p>${data.study.participants.length} / ${data.study.max_participants}</p>
        </div>
        <div class="study_tags">${tags}</div>
        <div class="study_leader">
            <img class="study_leader_img" src="${leader_img}" alt="leader_img">
            <p class="study_leader_name">${data.leader.nickname}</p>
        </div>
    `
    return study
}

