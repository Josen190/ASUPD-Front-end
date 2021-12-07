var dict = {
    "BUSINESS_ADMINISTRATOR": "Администратор",
    "CURATOR": "Куратор",
    "USER": "Пользователь"
}

var notPartOfProposalYet = [];
var listOfUsersToAdd = [];

function DeleteAlreadyChosen(listOfAllUsers) {
    var list = [];
    document.querySelectorAll('curator_find').forEach(element => {

    })

    for (var i = 0; i < listOfAllUsers.length; i++) {
        if (list.indexOf(listOfAllUsers[i]) == -1) notPartOfProjectYet.push(listOfAllUsers[i]);
    }
}

async function LoadManagers() {
    var place = document.querySelector('#members_list_search');
    document.querySelector('#user-list-added').innerHTML = "";
    document.querySelector('#members_list_search').innerHTML = "";
    notPartOfProposalYet = [];    
    
    var listOfUsers = await GetAllUsers();
    notPartOfProposalYet = listOfUsers;
    //await DeleteAlreadyChosen();
    for (var i = 0; i < notPartOfProposalYet.length; i++) {
        var user = await GetUser(notPartOfProposalYet[i]);

        if (user['role'] == 'BUSINESS_ADMINISTRATOR') continue;
        if (user['role'] == "USER") continue;

        var newUser = new User(user, notPartOfProposalYet[i]);
        newUser.loadUser();
    }
}
//Для модального окна
class User {
    constructor(params, idOfUser) {
        this.firstName = params['firstName'];
        this.lastName = params['lastName'];
        this.patronymic = params['patronymic'];
        this.role = params['role'];
        this.id = idOfUser;
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

async function AddCuratorsToFormOfProposal(place) {
    place.innerHTML = "";
    listOfUsersToAdd.forEach(user => {
        var newCurator = new AddedCurator(user, user.id);
        newCurator.render(place);
    });
    $('#AddMembersToProposal').modal('hide');
}

var listOfNewManagers = [];
var listOfNewCurators = [];
//Для списка в окне создания проектного предложения
class AddedCurator{
    constructor(params, idOfUser) {
        this.firstName = params['firstName'];
        this.lastName = params['lastName'];
        this.patronymic = params['patronymic'];
        this.id = idOfUser;
    }
    render(place){
        var dtElement = document.createElement('dt');
        dtElement.innerText = this.lastName + ' ' + this.firstName + ' ' + this.patronymic;
        place.appendChild(dtElement);        
    }
}