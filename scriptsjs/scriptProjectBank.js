let bank = document.getElementById("bank");
let loadCircle = document.getElementById("load_circle");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function removeAllChild(myNode){
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

function setOpacity(el, time) {
    let op = 0;
    while (op <= 1) {
        (function(_op) {
            setTimeout(function() { el.style.opacity = _op; }, time + op * 600);
        })(op);
        op += 0.1;
    }
}

let projectProposal = document.getElementById("project-proposal");
let form = projectProposal.querySelectorAll(".form");
function modalFormProject(projectID = "project_card"){
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
    for (let i = 0; i < arrDiv.length; i++){
        if (arrDiv[i].className == "name"){
            arrDiv[i].querySelector("h3").innerHTML = name;
        }else if(arrDiv[i].className == "basic-info") {
            arrDiv[i].innerHTML = info;
        }else if(arrDiv[i].className == "stages") {
            let arrStagesHtml = arrDiv[i].querySelector("dl");
            removeAllChild(arrStagesHtml);
            for (let i = 0; i < arrStages.length; i++){
                let stagesHtml = document.createElement('dt');
                stagesHtml.innerHTML = arrStages[i];
                arrStagesHtml.appendChild(stagesHtml);
            }
        }else if(arrDiv[i].className == "s-m") {
            let supervisors = arrDiv[i].querySelector(".supervisors");
            let arrSupervisorsHtml = arrDiv[i].querySelector("dl");
            removeAllChild(arrSupervisorsHtml);
            for (let i = 0; i < arrSupervisors.length; i++){
                let supervisorsHtml = document.createElement('dt');
                supervisorsHtml.innerHTML = arrSupervisors[i];
                arrSupervisorsHtml.appendChild(supervisorsHtml);
            }
            let mentors = arrDiv[i].querySelector(".mentors");
            let arrMentorsHtml = arrDiv[i].querySelector("dl");
            removeAllChild(arrMentorsHtml);
            for (let i = 0; i < arrMentors.length; i++){
                let mentorsHtml = document.createElement('dt');
                mentorsHtml.innerHTML = arrMentors[i];
                arrMentorsHtml.appendChild(mentorsHtml);
            }
        }
    }
}

function newProjectCard(projectID = "project_card", name = "Новый проект"){
  if ('content' in document.createElement('template')) {
    let template = document.getElementById("temp_project_card");
    let clone = template.content.cloneNode(true);

    clone.querySelector("p").innerHTML = name;
    clone.querySelector("img").src = "img/" + (1 + getRandomInt(6)) + ".jpg";
    clone.id = projectID;
    clone.querySelector(".listen").addEventListener("click", function(){
              loadCircle.removeAttribute("style");
//              modalFormProject(projectID);
//              loadCircle.setAttribute("style", "display: none");
//              projectProposal.removeAttribute("style");
              setTimeout(() => {
                        loadCircle.setAttribute("style", "display: none");
                        alert("Error");
                        projectProposal.removeAttribute("style");
                        setOpacity(projectProposal, 100);
                    }, 2000);
          });

    bank.appendChild(clone);
  }
}



document.addEventListener("click", function(e) {
  console.log(e.target);
  if (e.target.type == "button") {
    if(e.target.name == "close"){
      projectProposal.setAttribute("style", "display: none");
    }else if(e.target.name == "create"){
      alert("Error");
    }

  }
});
