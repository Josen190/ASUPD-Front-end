var dict = {
    "BUSINESS_ADMINISTRATOR": "Администратор",
    "CURATOR": "Куратор",
    "USER": "Пользователь"
}

const notPartOfProjectYet = []; //Тут будут храниться участники, которые не состоят в этом проекте
const listOfUsersToAdd = [];
const list_newMembers = [];
const list_newCurators = [];
var roleOfUser = "";

function DeleteAlreadyMembers(project, listOfAllUsers) {
    var list = [];
    list.push(project['projectManager'], project['userCaptain']);
    project['usersConsultantsUuidList'].forEach(element => { list.push(element) });
    project['usersMembersUuidList'].forEach(element => { list.push(element) });

    for (var i = 0; i < listOfAllUsers.length; i++) {
        if (list.indexOf(listOfAllUsers[i]) == -1) notPartOfProjectYet.push(listOfAllUsers[i]);
    }
}

async function LoadAllUsers() {    
    var listOfUsers = await GetAllUsers();
    var project = await GetProject(localStorage.getItem('tokenOfProject'));
    
    if (localStorage.getItem('token') == project['userCaptain']) roleOfUser = "Captain";
    else if (localStorage.getItem('token') == project['projectManager']) roleOfUser = "Manager";

    await DeleteAlreadyMembers(project, listOfUsers);

    for (var i = 0; i < notPartOfProjectYet.length; i++) {
        var user = await GetUser(notPartOfProjectYet[i]);

        if (user['role'] == 'BUSINESS_ADMINISTRATOR') continue;
        if (user['role'] == "CURATOR" && roleOfUser == "Captain") continue;
        if (user['role'] == "USER" && roleOfUser == "Manager") continue;

        var newUser = new User(user, notPartOfProjectYet[i]);
        newUser.loadUser();
    }
}

class User {
    constructor(params, idOfUser) {
        this.FullName = params['lastName'] + ' ' + params['firstName'] + ' ' + params['patronymic'];
        this.role = params['role'];
        this.id = idOfUser;
    }
    loadUser() {
        var divUserElement = document.createElement('div');
        divUserElement.classList.add("row", "align-items-center", "gy-5", "border-bottom");
        divUserElement.dataset.status = "new";
        //divUserElement.dataset.idOfUser = this.id;
        divUserElement.insertAdjacentHTML('beforeend',
            '<div class="col">' +
            '<div class="avatar">' +
            '<img src="../img/avatars/priroda-zhivotnye-kotenok.jpg" alt="avatar" class="img-fluid">' +
            '</div>' +
            '</div>' +
            '<div class="col-7">' +
            '<a href="#" target="_blank" rel="noopener noreferrer">' +
            '<b>' + this.FullName + '</b><br>' +
            '</a>' +
            '<small>' + dict[this.role] + '</small>' +
            '</div>' +
            '<div class="col-3">' +
            '<button class="btn btn-sm btn-secondary pull-right">' +
            '<i id = "icon" class="bi bi-plus-lg"></i>' +
            '</button>' +
            '</div>');

        divUserElement.addEventListener('click', () => {
            if (divUserElement.dataset.status == "new") {
                divUserElement.remove();
                divUserElement.dataset.status = "added";
                divUserElement.querySelector('#icon').classList = "";
                divUserElement.querySelector('#icon').classList.add("bi", "bi-backspace");
                document.querySelector('#listOfAddedUsers').append(divUserElement);

                listOfUsersToAdd.push(this);
            }
            else if (divUserElement.dataset.status == "added") {
                divUserElement.remove();
                divUserElement.dataset.status = "new";
                divUserElement.querySelector('#icon').classList = "";
                divUserElement.querySelector('#icon').classList.add("bi", "bi-plus-lg");
                document.querySelector('#listOfUsersToAdd').append(divUserElement);

                let i = listOfUsersToAdd.indexOf(this);
                listOfUsersToAdd.splice(i, 1);
            }
        });

        document.querySelector('#listOfUsersToAdd').append(divUserElement);
    }
}

async function AddUsersToMembersOfProject() {
    listOfUsersToAdd.forEach(user => {
        if (user.role == "USER") list_newMembers.push(user);
        else if (user.role == "CURATOR") list_newCurators.push(user);
    });
    if (roleOfUser == "Manager") await AddConsultants(list_newCurators.map((item) => { return item.id }));
    if (roleOfUser == "Captain") await AddMembers(list_newMembers.map((item) => { return item.id }));
}