var dict = {
    "BUSINESS_ADMINISTRATOR": "Администратор",
    "CURATOR": "Куратор",
    "USER": "Пользователь"
}

var notPartOfProposalYet = [];
var listOfUsersToAdd = [];

function DeleteAlreadyChosen(listOfAllUsers) {
    var list = [];
    listOfNewManagers.forEach(element => { list.push(element.id); });
    listOfNewCurators.forEach(element => { list.push(element.id); });

    if (list.length != 0) {
        for (var i = 0; i < listOfAllUsers.length; i++) {
            if (list.indexOf(listOfAllUsers[i]) == -1) notPartOfProposalYet.push(listOfAllUsers[i]);
        }
    } else notPartOfProposalYet = listOfAllUsers;
}

async function LoadManagers() {    
    listOfUsersToAdd = [];

    var place = document.querySelector('#members_list_search');
    document.querySelector('#user-list-added').innerHTML = "";
    document.querySelector('#members_list_search').innerHTML = "";
    notPartOfProposalYet = [];

    var listOfUsers = await GetAllUsers();
    await DeleteAlreadyChosen(listOfUsers);
    for (var i = 0; i < notPartOfProposalYet.length; i++) {
        var user = await GetUser(notPartOfProposalYet[i]);
        if (user['role'] != "CURATOR") continue;

        var newUser;
        if (categoryOfCuratorId == 'Supervisor') newUser = new User(user, notPartOfProposalYet[i], "Supervisor");
        else if (categoryOfCuratorId == 'Mentor') newUser = new User(user, notPartOfProposalYet[i], "Mentor");
        newUser.loadUser();
    }
}
//Для модального окна
class User {
    constructor(params, idOfUser, categoryOfCurator) {
        this.firstName = params['firstName'];
        this.lastName = params['lastName'];
        this.patronymic = params['patronymic'];
        this.role = params['role'];
        this.id = idOfUser;
        this.category = categoryOfCurator
    }
    loadUser() {
        var divUserElement = document.createElement('div');
        divUserElement.classList.add("row", "align-items-center", "gy-2", "border-bottom");
        divUserElement.dataset.status = "new";
        divUserElement.insertAdjacentHTML('beforeend',
            '<div class="col">' +
            '<div class="avatar">' +
            '<img src="../img/avatars/priroda-zhivotnye-kotenok.jpg" alt="avatar" class="img-fluid">' +
            '</div>' +
            '</div>' +
            '<div class="col-7">' +
            '<a href="#" target="_blank" rel="noopener noreferrer">' +
            '<b>' + this.lastName + ' ' + this.firstName + ' ' + this.patronymic + '</b><br>' +
            '</a>' +
            '<small>' + dict[this.role] + '</small>' +
            '</div>' +
            '<div class="col-3">' +
            '<button id="btn_members" class="btn btn-sm btn-outline-secondary pull-right">' +
            '<i id="icon" class="bi bi-plus-lg"></i>' +
            '</button>' +
            '</div>');

        divUserElement.querySelector('#btn_members').addEventListener('click', () => {
            if (divUserElement.dataset.status == "new") {
                divUserElement.remove();
                divUserElement.dataset.status = "added";
                divUserElement.querySelector('#icon').classList = "";
                divUserElement.querySelector('#icon').classList.add("bi", "bi-x-lg");
                document.querySelector('#user-list-added').append(divUserElement);

                listOfUsersToAdd.push(this);
            }
            else if (divUserElement.dataset.status == "added") {
                divUserElement.remove();
                divUserElement.dataset.status = "new";
                divUserElement.querySelector('#icon').classList = "";
                divUserElement.querySelector('#icon').classList.add("bi", "bi-plus-lg");
                document.querySelector('#members_list_search').append(divUserElement);

                let i = listOfUsersToAdd.indexOf(this);
                listOfUsersToAdd.splice(i, 1);
            }
        });

        document.querySelector('#members_list_search').append(divUserElement);
    }
}

var categoryOfCuratorId = "";
async function AddCuratorsToFormOfProposal() {
    listOfUsersToAdd.forEach(user => {
        var newCurator = new AddedCurator(user, user.id, user.category);        
        if (user.category == 'Supervisor') {
            listOfNewManagers.push(newCurator);
            newCurator.render(document.querySelector('#new-supervisors'));
        } else if (user.category == 'Mentor'){
            listOfNewCurators.push(newCurator);
            newCurator.render(document.querySelector('#new-mentors'));
        }
    });
    $('#AddMembersToProposal').modal('hide');
}

var listOfNewManagers = [];
var listOfNewCurators = [];
//Для списка в окне создания проектного предложения
class AddedCurator {
    constructor(params, idOfUser, category) {
        this.firstName = params['firstName'];
        this.lastName = params['lastName'];
        this.patronymic = params['patronymic'];
        this.id = idOfUser;
        this.category = category;
    }
    render(place) {
        var dtElement = document.createElement('dt');
        dtElement.innerText = this.lastName + ' ' + this.firstName + ' ' + this.patronymic;
        place.appendChild(dtElement);
 
        dtElement.addEventListener('click', () => {
            dtElement.remove();
            var i = listOfNewManagers.indexOf(this);
            if (i != -1) listOfNewManagers.splice(i, 1);
            i = listOfNewCurators.indexOf(this);
            if (i != -1) listOfNewCurators.splice(i, 1);
        });
    }
}