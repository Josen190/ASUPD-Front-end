function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

let bank = document.getElementById("bank");
let loadCircle = document.getElementById("load_circle");

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function removeAllChild(myNode) {
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function setOpacity(el, time) {
    let op = 0;
    while (op <= 1) {
        (function (_op) {
            setTimeout(function () { el.style.opacity = _op; }, time + op * 600);
        })(op);
        op += 0.1;
    }
}

let projectProposal = document.getElementById("project-proposal");
let form = projectProposal.querySelectorAll(".form");
function modalFormProject(projectID = "project_card") {
    //    //добовляем имя
    //    form.name.querySelector("h3").innerHTML = name;
    //    //добовляем основную иинформацию
    //    form.basic-info.arrDiv[i].innerHTML = info;
    //
    //    //доболяем стадии
    //    let arrStagesHtml = form.stages.querySelector("dl");
    //    removeAllChild(arrStagesHtml); //удаляем предыдущие стадии
    //    for (let i = 0; i < arrStages.length; i++){
    //        let stagesHtml = document.createElement('dt');
    //        stagesHtml.innerHTML = arrStages[i];
    //        arrStagesHtml.appendChild(stagesHtml);
    //    }
    //
    //    //добовляем руговодителей
    //    let arrSupervisorsHtml = form.s-m.supervisors.querySelector("dl");
    //    removeAllChild(arrSupervisorsHtml);//удаляем предыдущих руководителей
    //    for (let i = 0; i < arrSupervisors.length; i++){
    //        let supervisorsHtml = document.createElement('dt');
    //        supervisorsHtml.innerHTML = arrSupervisors[i];
    //        arrSupervisorsHtml.appendChild(supervisorsHtml);
    //    }
    //
    //    //добовляем наставников
    //    let arrMentorsHtml = form.s-m.mentors.querySelector("dl");
    //    removeAllChild(arrMentorsHtml);//удаляем предыдущих наставников
    //    for (let i = 0; i < arrMentors.length; i++){
    //        let mentorsHtml = document.createElement('dt');
    //        mentorsHtml.innerHTML = arrMentors[i];
    //        arrMentorsHtml.appendChild(mentorsHtml);
    //    }

    let arrDiv = form.querySelectorAll("div");
    for (let i = 0; i < arrDiv.length; i++) {
        if (arrDiv[i].className == "name") {
            arrDiv[i].querySelector("h3").innerHTML = name;
        } else if (arrDiv[i].className == "basic-info") {
            arrDiv[i].innerHTML = info;
        } else if (arrDiv[i].className == "stages") {
            let arrStagesHtml = arrDiv[i].querySelector("dl");
            removeAllChild(arrStagesHtml);
            for (let i = 0; i < arrStages.length; i++) {
                let stagesHtml = document.createElement('dt');
                stagesHtml.innerHTML = arrStages[i];
                arrStagesHtml.appendChild(stagesHtml);
            }
        } else if (arrDiv[i].className == "s-m") {
            let supervisors = arrDiv[i].querySelector(".supervisors");
            let arrSupervisorsHtml = arrDiv[i].querySelector("dl");
            removeAllChild(arrSupervisorsHtml);
            for (let i = 0; i < arrSupervisors.length; i++) {
                let supervisorsHtml = document.createElement('dt');
                supervisorsHtml.innerHTML = arrSupervisors[i];
                arrSupervisorsHtml.appendChild(supervisorsHtml);
            }
            let mentors = arrDiv[i].querySelector(".mentors");
            let arrMentorsHtml = arrDiv[i].querySelector("dl");
            removeAllChild(arrMentorsHtml);
            for (let i = 0; i < arrMentors.length; i++) {
                let mentorsHtml = document.createElement('dt');
                mentorsHtml.innerHTML = arrMentors[i];
                arrMentorsHtml.appendChild(mentorsHtml);
            }
        }
    }
}

// function newProposalCard(name = "Новый проект", uuid=""){
//   if ('content' in document.createElement('template')) {
//     let template = document.getElementById("temp_project_card");
//     let clone = template.content.cloneNode(true);

//     clone.querySelector("p").innerHTML = name;
//     clone.querySelector("img").src = "../img/Bg_PB/" + (1 + getRandomInt(6)) + ".jpg";
//     clone.querySelector("#testProject").dataset.uuid = uuid;
//     clone.querySelector(".listen").addEventListener("click", async function(){
//               loadCircle.removeAttribute("style");
//               let el = clone.querySelector("#testProject").dataset.uuid;
// //              modalFormProject(projectID);
// //              loadCircle.setAttribute("style", "display: none");
// //              projectProposal.removeAttribute("style");
//               setTimeout(() => {
//                         loadCircle.setAttribute("style", "display: none");
//                         projectProposal.removeAttribute("style");
//                         setOpacity(projectProposal, 100);
//                     }, 2000);
//           });

//     bank.appendChild(clone);
//   }
// }

function newProposalCard(name = "Новый проект", uuid = "") {
    var proposal_icon_div = document.createElement('div');
    setAttributes(proposal_icon_div, { "id": "testProject", "class": "project-card", "data-uuid": uuid });    
    proposal_icon_div.insertAdjacentHTML('beforeend',
        '<div class="info">' +
            '<img src = "../img/Bg_PB/1.jpg">' +
        '</div>' +
        '<div class="name">' +
            '<p ib="name"></p>' +
        '</div>');
    proposal_icon_div.querySelector("p").innerHTML = name;
    proposal_icon_div.querySelector("img").src = "../img/Bg_PB/" + (1 + getRandomInt(6)) + ".jpg";
    proposal_icon_div.addEventListener('click', async () => {
        loadCircle.removeAttribute("style");        

        var informationAboutProject = await LoadInformationAboutProposal(proposal_icon_div.getAttribute('data-uuid'));
        var managerUser = await GetUser(informationAboutProject['projectManagersUuidList'][0]);

        document.querySelector('#project-proposal').dataset.uuidOfProposalWindow = informationAboutProject['id'];
        document.querySelector('#nameOfProposal').textContent = informationAboutProject['name'];
        document.querySelector('#basicInfoAboutProposal').textContent = informationAboutProject['information'];
        document.querySelector('#supervisors').textContent = managerUser['firstName'] + ' ' + managerUser['lastName'] + ' ' + managerUser['patronymic'];
        document.querySelector('#supervisors').dataset.uuidOfManager = informationAboutProject['projectManagersUuidList'][0];

        setTimeout(() => {
            loadCircle.setAttribute("style", "display: none");
            projectProposal.removeAttribute("style");
            setOpacity(projectProposal, 100);
        }, 2000);
    })
    bank.appendChild(proposal_icon_div);
}

// document.addEventListener("click", function (e) {
//     console.log(e.target);
//     if (e.target.type == "button") {
//         if (e.target.name == "close") {
//             projectProposal.setAttribute("style", "display: none");
//         } else if (e.target.name == "create") {
//             alert("Error");
//         }

//     }
// });
