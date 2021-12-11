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
var selectedManager;
var selectedProposalCard;

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
    async render(place) {
        var proposal_icon_div = document.createElement('div');
        setAttributes(proposal_icon_div, { "id": "testProject", "class": "project-card" });
        proposal_icon_div.insertAdjacentHTML('beforeend',
            '<div class="info">' +
            '<img src = "../img/Bg_PB/1.jpg">' +
            '</div>' +
            '<div class="name">' +
            '<p id="nameProposalCard"></p>' +
            '</div>' +
            '<div class="listen"></div>' +
            '<button style="display:none" class="close">' +
            '<ion-icon name="close-circle-outline"></ion-icon>' +
            '</button>');
        proposal_icon_div.querySelector("p").innerHTML = this.ProposalEntity.name;
        proposal_icon_div.querySelector("img").src = "../img/Bg_PB/" + (1 + getRandomInt(6)) + ".jpg";

        var user = await GetUser(localStorage.getItem('token'));
        proposal_icon_div.addEventListener('click', async () => {
            
            if (user['role'] != "BUSINESS_ADMINISTRATOR") this.openProposalAsUser();
            else { 
                selectedProposalCard = proposal_icon_div;
                this.openProposalAsAdmin();
            }
        });

        if (user['role'] == "BUSINESS_ADMINISTRATOR") proposal_icon_div.querySelector('.close').removeAttribute('style');
        proposal_icon_div.querySelector('.close').addEventListener('click', async (e) => {
            e.stopPropagation();
            proposal_icon_div.remove();
            await DeleteProposal(this.ProposalEntity.id);
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

        divProjectContainer.querySelector('#cancelOldProposal').addEventListener('click', () => {
            divProjectContainer.setAttribute("style", "display:none");
        });

        divProjectContainer.querySelector('#createProposal').disabled = true;
        divProjectContainer.querySelector('#createProposal').addEventListener('click', () => {
            CreateProjectFromProposal(this.ProposalEntity.id, selectedManager.dataset.uuidOfManager);
        });

        loadCircle.removeAttribute("style");

        divProjectContainer.querySelector('#nameOfProposal').textContent = this.ProposalEntity.name;
        divProjectContainer.querySelector('#basicInfoAboutProposal').textContent = this.ProposalEntity.information;

        divProjectContainer.querySelector('#supervisors').innerHTML = "";
        divProjectContainer.querySelector('.mentors').innerHTML = "";
        divProjectContainer.querySelector('#nameOfStage').innerHTML = "";

        for (var i = 0; i < this.ProposalEntity.managerList.length; i++) {
            var managerUser = await GetUser(this.ProposalEntity.managerList[i]);

            var dtManager = document.createElement('dt');
            dtManager.dataset.uuidOfManager = this.ProposalEntity.managerList[i];
            dtManager.innerText = managerUser['lastName'] + ' ' + managerUser['firstName'] + ' ' + managerUser['patronymic'];
            dtManager.classList.add('selectedManagers');

            divProjectContainer.querySelector('#supervisors').append(dtManager);            
        }
        divProjectContainer.querySelector('#supervisors').onclick = function(event) {
            let dt = event.target.closest('dt');

            if (!dt) return;

            if (!divProjectContainer.querySelector('#supervisors').contains(dt)) return;
            
            divProjectContainer.querySelector('#createProposal').disabled = false;
            if (selectedManager){
                selectedManager.removeAttribute('style');
            }            
            selectedManager = dt;
            selectedManager.setAttribute('style', 'background-color: blue');            
        }
        

        for (var i = 0; i < this.ProposalEntity.curatorsList.length; i++) {
            var curatorUser = await GetUser(this.ProposalEntity.curatorsList[i]);

            var dtCurator = document.createElement('dt');
            dtCurator.innerText = curatorUser['lastName'] + ' ' + curatorUser['firstName'] + ' ' + curatorUser['patronymic'];
            divProjectContainer.querySelector('.mentors').appendChild(dtCurator);
        }
        for (var i = 0; i < this.ProposalEntity.stagesList.length; i++) {
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
    async openProposalAsAdmin() {
        LoadFormOfNewProposal();   
        
        document.getElementById('btnCreateNewProposal').setAttribute('style', 'display:none');
        document.getElementById('btnSaveProposal').removeAttribute('style');

        document.querySelector('#nameOfNewProposal').value = this.ProposalEntity.name;
        document.querySelector('#basicInfoAboutNewProposal').value = this.ProposalEntity.information;
        for (var i = 0; i < this.ProposalEntity.stagesList.length; i++) {
            var new_stage = new Stage(this.ProposalEntity.stagesList[i]);
            new_stage.render();
            list_stages_to_add.push(new_stage);
        }
        for (var i = 0; i < this.ProposalEntity.managerList.length; i++) {
            var user = await GetUser(this.ProposalEntity.managerList[i]);                 
            var added_manager = new User(user, this.ProposalEntity.managerList[i], 'Supervisor'); 
            listOfUsersToAdd.push(added_manager);
        }
        for (var i = 0; i < this.ProposalEntity.curatorsList.length; i++) {
            var user = await GetUser(this.ProposalEntity.curatorsList[i]);                 
            var added_curator = new User(user, this.ProposalEntity.curatorsList[i], 'Mentor'); 
            listOfUsersToAdd.push(added_curator);
        }
        AddCuratorsToFormOfProposal();     

        document.querySelector('#btnSaveProposal').addEventListener('click', async ()=>{            
            this.ProposalEntity.name = document.querySelector('#nameOfNewProposal').value;
            selectedProposalCard.querySelector('#nameProposalCard').innerText = document.querySelector('#nameOfNewProposal').value;
            this.ProposalEntity.information = document.querySelector('#basicInfoAboutNewProposal').value;
            this.ProposalEntity.stagesList = list_stages_to_add.map((item) => { return item.text });
            this.ProposalEntity.managerList = listOfNewManagers.map((item) => { return item.id });
            this.ProposalEntity.curatorsList = listOfNewCurators.map((item) => { return item.id });

            await ChangeProposal(this.ProposalEntity.id, document.querySelector('#nameOfNewProposal').value, document.querySelector('#basicInfoAboutNewProposal').value, list_stages_to_add, listOfNewManagers, listOfNewCurators);
            document.querySelector('#new-project-proposal').remove();
        });
        document.querySelector('#btnSaveProposal').value = "Сохранить изменения";
    }
}

var candidatesForManager = [];

function LoadFormOfNewProposal() {
    loadCircle.removeAttribute("style");

    var newProposal = document.createElement('div');
    newProposal.id = "new-project-proposal";
    newProposal.classList.add('new-project-proposal');
    newProposal.setAttribute('style', 'display: none');

    newProposal.insertAdjacentHTML('beforeend', 
        '<div class="form">' +
            '<div class="header">' +
                '<p>Создать проектное предложение</p>' +
            '</div>' +
            '<div class="name">' +
                '<input id="nameOfNewProposal" type="text" placeholder="Название">' +
            '</div>' +
            '<div class="basic-info">' +
                '<textarea id="basicInfoAboutNewProposal" placeholder="Основная информация"></textarea>' +
            '</div>' +            
            '<div class="stages">' +
                '<dl id="new-stages-list"></dl>' +
                '<input class="newStage-input" type="text">' +
                '<button id="new-stages-btn" type="button">+</button>' +
            '</div>' +
            '<div class="s-m">' +            
                '<div class="supervisors">' +
                    '<dl id="new-supervisors"></dl>' +
                    '<button id="btnAddSuperVisors" type="button" data-toggle="modal" data-target="#AddMembersToProposal">Добавить</button>' +
                '</div>' +
                '<div class="new-mentors">' +
                    '<dl id="new-mentors"></dl>' +
                    '<button id="btnAddMentors" type="button" data-toggle="modal" data-target="#AddMembersToProposal">Добавить</button>' +
                '</div>' +
            '</div>' +
            '<div class="button">' +
                '<input id="btnCancelPropopsal" type="button" name="close" value="Отмена">' +
                '<input id="btnSaveProposal" style="display: none;" type="button" value="Сохранить проектное предложение">' +
                '<input id="btnCreateNewProposal" style="display: none;" type="button" value="Создать проектное предложение">' +
            '</div>' +
        '</div>');    

    newProposal.querySelector('#btnCancelPropopsal').addEventListener('click', () => {
        newProposal.remove();
    });
    
    newProposal.querySelector("#new-stages-btn").addEventListener('click', () => {
        var nameOfStage = document.querySelector('.newStage-input').value;
        if (nameOfStage != "") {
            var new_stage = new Stage(nameOfStage);
            new_stage.render();
            list_stages_to_add.push(new_stage);
            document.querySelector('.newStage-input').value = "";
        }
    });

    newProposal.querySelector('#btnAddSuperVisors').addEventListener('click', () => {
        categoryOfCuratorId = 'Supervisor';
        LoadManagers();
    });

    newProposal.querySelector('#btnAddMentors').addEventListener('click', () => {
        categoryOfCuratorId = 'Mentor';
        LoadManagers();
    });

    newProposal.querySelector('#btnCreateNewProposal').addEventListener('click', () => {
        CreateNewProposal();        
    });

    document.getElementById('load_circle').before(newProposal);

    candidatesForManager = [];
    listOfNewManagers = [];
    listOfNewCurators = [];
    list_stages_to_add = [];
    listOfUsersToAdd = [];

    setTimeout(() => {
        loadCircle.setAttribute("style", "display: none");
        newProposal.removeAttribute("style");
        setOpacity(newProposal, 100);
    }, 2000);
}

async function CreateNewProposal() {
    var id = await CreateProposal(document.querySelector('#nameOfNewProposal').value, document.querySelector('#basicInfoAboutNewProposal').value,
        list_stages_to_add, listOfNewManagers, listOfNewCurators);
    document.querySelector('#new-project-proposal').setAttribute('style', 'display:none');
    var proposalParams = {
        'id': id,
        'name': document.querySelector('#nameOfNewProposal').value,
        'information': document.querySelector('#basicInfoAboutNewProposal').value,
        'stageNamesList': list_stages_to_add.map((item) => { return item.text }),
        'projectManagersUuidList': listOfNewManagers.map((item) => { return item.id }),
        'consultantUuidList': listOfNewCurators.map((item) => { return item.id })
    }
    LoadProposalCard(proposalParams);
    document.querySelector('#new-project-proposal').remove();
}

var list_stages_to_add = [];
class Stage {
    constructor(textOfStage) {
        this.text = textOfStage;
    }
    render() {
        var dtStage = document.createElement('dt');
        dtStage.innerText = this.text;
        document.querySelector('#new-stages-list').appendChild(dtStage);

        dtStage.addEventListener('click', () => {
            var i = list_stages_to_add.indexOf(this);
            if (i != -1) list_stages_to_add.splice(i, 1);

            dtStage.remove();
        });
    }
}


document.querySelector('#btnCreateProposalForm').addEventListener('click', ()=>{
    LoadFormOfNewProposal();    
    document.getElementById('btnSaveProposal').setAttribute('style', 'display:none');
    document.getElementById('btnCreateNewProposal').removeAttribute('style');
});
