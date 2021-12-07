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

function modalFormProject(projectID = "project_card") {
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

async function LoadProposalCard(proposalParams) {
    var loaded_proposal = new Proposal(proposalParams);
    ProposalArray.push(loaded_proposal);
    loaded_proposal.render(bank);
}

var ProposalArray = [];

class Proposal {
    constructor(proposalParams) {
        this.ProposalEntity = {
            id: proposalParams['id'],
            name: proposalParams['name'],
            information: proposalParams['information'],
            stagesList: proposalParams['stageNamesList'],
            managerList: proposalParams['projectManagersUuidList'],
            curatorsList: proposalParams['consultantUuidList']
        }
    }
    render(place) {
        var proposal_icon_div = document.createElement('div');
        setAttributes(proposal_icon_div, { "id": "testProject", "class": "project-card"});
        proposal_icon_div.insertAdjacentHTML('beforeend',
            '<div class="info">' +
            '<img src = "../img/Bg_PB/1.jpg">' +
            '</div>' +
            '<div class="name">' +
            '<p ib="name"></p>' +
            '</div>');
        proposal_icon_div.querySelector("p").innerHTML = this.ProposalEntity.name;
        proposal_icon_div.querySelector("img").src = "../img/Bg_PB/" + (1 + getRandomInt(6)) + ".jpg";

        proposal_icon_div.addEventListener('click', async () => {
            var user = await GetUser(localStorage.getItem('token'));
            if (user['role'] != "BUSINESS_ADMINISTRATOR") this.openProposalAsUser();
            else this.openProposalAsAdmin();
        })

        place.appendChild(proposal_icon_div);
    }
    async openProposalAsUser() {
        var divProjectContainer = document.createElement('div');
        divProjectContainer.classList.add('project-proposal')
        divProjectContainer.insertAdjacentHTML('beforeend',
        '<div class="form">' +
            '<div class="name">' +
                '<h2 id="nameOfProposal">Название</h2>' +
            '</div>' +
            '<div id="basicInfoAboutProposal" class="basic-info">' +
                'Основная информация' +
            '</div>' +
            '<div class="stages">' +
                '<dl id="nameOfStage"></dl>' +
            '</div>' +
            '<div class="s-m">' +
                '<div><dl id="supervisors" class="supervisors"></dl></div>' +
                '<div><dl class="mentors"></dl></div>' +
            '</div>' +
            '<div class="button">' +
                '<input id="cancelOldProposal" type="button" name="close" value="Отмена">' +
                '<input id="createProposal" type="button" name="create" value="Создать проект">' +
            '</div>' +
        '</div>');

        divProjectContainer.querySelector('#cancelOldProposal') .addEventListener('click', () => {
            divProjectContainer.setAttribute("style","display:none");
        });

        divProjectContainer.querySelector('#createProposal') .addEventListener('click', () => {
            CreateProjectFromProposal(this.ProposalEntity.id, this.ProposalEntity.managerList[0]);
        });

        loadCircle.removeAttribute("style");

        divProjectContainer.querySelector('#nameOfProposal').textContent = this.ProposalEntity.name;
        divProjectContainer.querySelector('#basicInfoAboutProposal').textContent = this.ProposalEntity.information;
        
        divProjectContainer.querySelector('#supervisors').innerHTML = "";
        divProjectContainer.querySelector('.mentors').innerHTML = "";
        divProjectContainer.querySelector('#nameOfStage').innerHTML = "";

        for(var i = 0; i < this.ProposalEntity.managerList.length; i++){
            var managerUser = await GetUser(this.ProposalEntity.managerList[i]);

            var dtManager = document.createElement('dt');
            dtManager.innerText = managerUser['lastName'] + ' ' + managerUser['firstName'] + ' ' + managerUser['patronymic'];            
            divProjectContainer.querySelector('#supervisors').appendChild(dtManager);
        }
        for(var i = 0; i < this.ProposalEntity.curatorsList.length; i++){
            var curatorUser = await GetUser(this.ProposalEntity.curatorsList[i]);

            var dtCurator = document.createElement('dt');
            dtCurator.innerText = curatorUser['lastName'] + ' ' + curatorUser['firstName'] + ' ' + curatorUser['patronymic'];            
            divProjectContainer.querySelector('.mentors').appendChild(dtCurator);
        }
        for(var i = 0; i < this.ProposalEntity.stagesList.length; i++){            
            var dt = document.createElement('dt');
            dt.innerText = this.ProposalEntity.stagesList[i];            
            divProjectContainer.querySelector('#nameOfStage').appendChild(dt);
        }    
        setTimeout(() => {
            loadCircle.setAttribute("style", "display: none");
            divProjectContainer.removeAttribute("style");
            document.querySelector('#load_circle').before(divProjectContainer);
            setOpacity(divProjectContainer, 100);
        }, 2000);
    }
    async openProposalAsAdmin(){

    }
}

var candidatesForManager = [];

function LoadFormOfNewProposal() {
    loadCircle.removeAttribute("style");

    var newProjectProposal = document.querySelector('#new-project-proposal');

    document.querySelector('#new-stages-list').innerHTML = "";
    document.querySelector('#new-supervisors').innerHTML = "";
    document.querySelector('#new-mentors').innerHTML = "";
    candidatesForManager = [];

    setTimeout(() => {
        loadCircle.setAttribute("style", "display: none");
        newProjectProposal.removeAttribute("style");
        setOpacity(newProjectProposal, 100);
    }, 2000);
}

document.querySelector("#new-stages-btn").addEventListener('click', () => {
    var nameOfStage = document.querySelector('.newStage-input').value;
    if (nameOfStage != ""){
        var dtStage = document.createElement('dt');
        dtStage.innerText = nameOfStage;
        document.querySelector('#new-stages-list').appendChild(dtStage);
        document.querySelector('.newStage-input').value = "";
    }
});

// document.querySelector('#new-managers-btn').addEventListener('click', () => {
//     localStorage.setItem('method_to_call', "AddManagersToProposal");
//     document.location = "Adding_members_for_proposal.html";    
// })