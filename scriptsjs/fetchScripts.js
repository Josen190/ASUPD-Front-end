var URL_link = "http://localhost:8080";
var dateWithoutTime = new Intl.DateTimeFormat("ru", {
  dateStyle: "short",
  formatMatcher: "best fit"
});

var dictOfStatus = {
  "BUSINESS_ADMINISTRATOR": "Администратор",
  "CURATOR": "Куратор",
  "USER": "Пользователь"
}

//Функции общего назначения
//===================================================================================================//
//Проверка токена
async function checkToken() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const status = await fetch(URL_link + "/user/self", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return true;
    })
    .catch(error => {
      console.log('error', error);
      alert('Нет токена');
      return false;
    });
  return status;
}
//Возвращает данные пользователя учитывая токен в sessionstorage
async function GetUser(tokenOfUser) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const result = await fetch(URL_link + "/user/" + tokenOfUser, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в GetUser');
    });
  return result;
}
async function GetAllUsers() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + "/user/all", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в GetAllUser');
    });
  return response;
}
async function GetStage(tokenOfStage) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + "/stage/" + tokenOfStage + "?projectUuid=" + localStorage.getItem('tokenOfProject'), requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в GetStage');
    });
  return response;
}
async function GetCard(tokenOfCard) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + "/card/" + tokenOfCard, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в GetCard');
    });
  return response;
}
async function GetProject(tokenOfProject) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + "/project/" + tokenOfProject, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в GetCard');
    });
  return response;
}
//===================================================================================================//


//Регистрация и авторизация
//===================================================================================================//
async function Send_Registration_Form(email, password, first_name, last_name, patronymic, data, phone, post, place_work) {
  var myHeaders = new Headers();
  myHeaders.append("login", email);
  myHeaders.append("password", password);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "firstName": first_name,
    "lastName": last_name,
    "patronymic": patronymic,
    "birthDate": data,
    "phoneNumber": phone,
    "status": post,
    "workPlace": place_work
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  let response = await fetch(URL_link + "/auth/sign_up", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.text();
    })
    .then((result) => {
      localStorage.setItem('token', result);
      document.location.href = "account.html"
    })
    .catch(error => console.log('error', error))
}
async function sendAuthorizationForm() {
  var myHeaders = new Headers();
  myHeaders.append("login", document.getElementById('login_1').value);
  myHeaders.append("password", document.getElementById('password_1').value);
  myHeaders.append("Authorization", "");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(URL_link + '/auth/sign_in', requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.text();
    })
    .then(async (result) => {
      localStorage.setItem('token', result);
      var user = await GetUser(result);
    })
    .then(() => document.location.href = "account.html")
    .catch(error => {
      console.log('error', error);
      alert('Ошибочный запрос');
    });
}
//===================================================================================================//


//Страница личного кабинета
//===================================================================================================//
//Загружает информацию о пользователе на странице личного кабинета
async function LoadInformationOfUserForAccount() {
  var result = await GetUser(localStorage.getItem('token'));

  if (result['lastName'] && result['firstName']) {
    document.getElementById('full_name').innerText = result['lastName'] + ' ' + result['firstName'];
    if (result['patronymic']) document.getElementById('full_name').innerText += ' ' + result['patronymic'];
  }
  else document.getElementById('full_name').value = 'Фамилия' + ' ' + 'Имя' + ' ' + 'Отчество';

  document.getElementById('work_place').innerText += ': ' + (result['workPlace'] ?? 'не указано');
  document.getElementById('status').innerText += ': ' + (result['status'] ?? 'не указано');
  if (result['birthDate'] != null) document.getElementById('birthday').innerText += ': ' + dateWithoutTime.format(Date.parse(result['birthDate']));
  document.getElementById('phone').innerText += ': ' + (result['phoneNumber'] ?? 'не указано');
  document.getElementById('role').innerText += ': ' + (dictOfStatus[result['role']] ?? 'не указано');

  let container = document.querySelector("#projects-list");
  for (var i = 0; i < Object.keys(result['projectUuidList']).length; i++) {
    var project = await GetProject(result['projectUuidList'][i]);
    let liElement = document.createElement('li');
    liElement.insertAdjacentHTML('beforeend', '<div class = "tempObject">' + project['name'] + '</div>');
    liElement.dataset.uuidOfProject = result['projectUuidList'][i];
    liElement.addEventListener('click', () => {
      localStorage.setItem('tokenOfProject', liElement.dataset.uuidOfProject);
      document.location.href = "project.html";
    });

    container.appendChild(liElement);
  }
}
async function LoadInformationOfUserForEditAccout() {
  var result = await GetUser(localStorage.getItem('token'));

  document.getElementById('last-name').value = result['lastName'];
  document.getElementById('first-name').value = result['firstName'];
  document.getElementById('partonymic').value = result['patronymic'];
  document.getElementById('workplace').value = result['workPlace'];
  document.getElementById('status').value = result['status'];
  document.getElementById('birth_date').value = dateWithoutTime.format(Date.parse(result['birthDate']));
  document.getElementById('phone').value = result['phoneNumber'];
}
async function SendChangesOnEditAccount() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "firstName": document.getElementById('first-name').value,
    "lastName": document.getElementById('last-name').value,
    "patronymic": document.getElementById('partonymic').value,
    "birthDate": Date.parse(document.getElementById('birth_date').value),
    "phoneNumber": document.getElementById('phone').value,
    "status": document.getElementById('status').value,
    "workPlace": document.getElementById('workplace').value
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(URL_link + "/user/self", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      document.location = "account.html";
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в SendChangesOnEditAccount');
    });

}
//===================================================================================================//


//Банк предложений
//===================================================================================================//
//Загружает предложения в банке предложений 
async function LoadAllProposals() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  await fetch(URL_link + "/project_proposal/get_all", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then(async (result) => {
      var user = await GetUser(localStorage.getItem('token'));
      if (user['role'] == 'BUSINESS_ADMINISTRATOR') document.querySelector('#btnCreateProposalForm').removeAttribute('style');

      let proposalsArray = Object.keys(result).length;
      for (var i = 0; i < Object.keys(result).length; i++) {
        await LoadInformationAboutProposal(result[i]).then(async (response) => {
          await LoadProposalCard(response);
        });
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadAllProposals');
    });
}
//Загружает информацию для окна при нажатии на проектное предложение
async function LoadInformationAboutProposal(tokenOfProposal) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + "/project_proposal/" + tokenOfProposal, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadInformationAboutProposal');
    });
  return response;
}
async function CreateProjectFromProposal(proposalId, managerId) {
  var myHeaders = new Headers();
  myHeaders.append("managerId", managerId);
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(URL_link + "/project_proposal/" + proposalId, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      localStorage.setItem('tokenOfProject', result);
      document.location.href = "project.html";
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadInformationAboutProposal');
    });
}
async function DeleteProposal(proposalId) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(URL_link + "/project_proposal/" + proposalId, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в DeleteProposal');
    });
}
async function CreateProposal(nameOfNewProposal, informationAboutProposal, list_stages_to_add, listOfNewManagers, listOfNewCurators) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var usersMembersUuidList = [];
  var raw = JSON.stringify({
    "name": nameOfNewProposal,
    "information": informationAboutProposal,
    "projectManagersUuidList": listOfNewManagers.map((item) => { return item.id }),
    "consultantUuidList": listOfNewCurators.map((item) => { return item.id }),
    "stageNamesList": list_stages_to_add.map((item) => { return item.text })
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const id = await fetch(URL_link + "/project_proposal/", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в GetAllComments')
    });
  return id;
}
async function ChangeProposal(tokenOfProposal, nameOfNewProposal, informationAboutProposal, list_stages_to_add, listOfNewManagers, listOfNewCurators) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var usersMembersUuidList = [];
  var raw = JSON.stringify({
    "name": nameOfNewProposal,
    "information": informationAboutProposal,
    "projectManagersUuidList": listOfNewManagers.map((item) => { return item.id }),
    "consultantUuidList": listOfNewCurators.map((item) => { return item.id }),
    "stageNamesList": list_stages_to_add.map((item) => { return item.text })
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  await fetch(URL_link + "/project_proposal/" + tokenOfProposal, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в ChangeProposal')
    });
}
//===================================================================================================//


//Страница проекта
//===================================================================================================//
async function LoadProjectInformation() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + '/project/' + localStorage.getItem('tokenOfProject'), requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then(async (result) => {
      document.querySelector('#nameOfProject').value = result['name'];
      switch (result['projectStatus']) {
        case 'IN_PROCESS':
          document.querySelector('#inputStatus').value = 'В процессе';
          break;
        case 'FROZEN':
          document.querySelector('#inputStatus').value = 'Приостановлен';
          break;
        case 'DONE':
          document.querySelector('#inputStatus').value = 'Завершён';
          break;
        default:
          break;
      }
      var userParams = await GetUser(localStorage.getItem('token'));
      userRole = userParams['role'];
      if (localStorage.getItem('token') == result['userCaptain']) userRole = "Captain";
      if (localStorage.getItem('token') == result['projectManager']) userRole = "Manager";
      
      for (var i = 0; i < Object.keys(result['stageUuidList']).length; i++) {
        await LoadStageAndCardsFromDB(result['stageUuidList'][i]);
        document.querySelector('[data-uuid-of-stage="' + result['stageUuidList'][i] + '"]').querySelector('.number-cards').innerText =
          document.querySelector('[data-uuid-of-stage="' + result['stageUuidList'][i] + '"]').querySelector('.col-content').childElementCount;
      }

      await LoadMembersOfProject(result);
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadProjectFunction');
    });
  return response;
}
async function DeleteStage(tokenOfStage) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(URL_link + '/stage/' + tokenOfStage + '?projectUuid=' + localStorage.getItem('tokenOfProject'), requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в DeleteStage');
    });
}
async function AddStage(nameOfStage) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "name": nameOfStage
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + '/stage?projectUuid=' + localStorage.getItem('tokenOfProject'), requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в AddStage');
    });
  return response;
}
async function EditStage(tokenOfStage, newName) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "name": newName
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(URL_link + "/stage/" + tokenOfStage +  "?projectUuid=" + localStorage.getItem('tokenOfProject'), requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      console.log('Стадия была обновлена');
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в EditStage');
    });
}
async function LoadCard(tokenOfCard) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + "/card/" + tokenOfCard, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadCard');
    });
  return response;
}
async function AddCard(tokenOfStage, name, content) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "name": name,
    "lastModifiedUserId": localStorage.getItem('token'),
    "content": content
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + "/card/?projectUuid=" + localStorage.getItem('tokenOfProject') + "&stageUuid=" + tokenOfStage, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в AddCard');
    });
  return response;
}
async function DeleteCard(tokenOfCard) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  await fetch(URL_link + "/card/" + tokenOfCard, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в DeleteCard');
    });
}
async function EditCard(tokenOfCard, name, status, content, mark) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  if (mark == '') mark = null;
  var raw = JSON.stringify({
    "name": name,
    "status": status,
    "content": content,
    "mark": mark
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(URL_link + "/card/" + tokenOfCard, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      console.log('Карточка была обновлена');
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadCard');
    });
}
async function EditProject(tokenOfProject, name, projectStatus) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "name": name,
    "projectStatus": projectStatus
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(URL_link + "/project/" + tokenOfProject, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в EditProject');
    });
}
async function GetAllComments(tokenOfProject, tokenOfCard) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + "/comment/get_all?projectUuid=" + tokenOfProject + "&cardUuid=" + tokenOfCard, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в GetAllComments');
    });
  return response;
}
async function CreateComment(tokenOfProject, tokenOfCard, contentOfComment) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "content": contentOfComment
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + "/comment/?projectUuid=" + tokenOfProject + "&cardUuid=" + tokenOfCard, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в CreateComment');
    });
  return response;
}
async function DeleteComment(tokenOfProject, tokenOfCard, tokenOfComment) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(URL_link + "/comment/" + tokenOfComment + "?projectUuid=" + tokenOfProject + "&cardUuid=" + tokenOfCard, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      console.log('Карточка была обновлена');
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в DeleteComment');
    });
}
//===================================================================================================//



//Управление участниками проекта
//===================================================================================================//
async function AddConsultants(list_tokenOfConultant) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var usersConsultantsUuidList = [];
  list_tokenOfConultant.forEach(element => { usersConsultantsUuidList.push(element) });
  var raw = JSON.stringify({
    usersConsultantsUuidList
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(URL_link + "/project/" + localStorage.getItem('tokenOfProject') + "/add_consultants", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
    })
    .catch(error => console.log('error', error));
}
async function AddMembers(list_tokenOfMember) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var usersMembersUuidList = [];
  list_tokenOfMember.forEach(element => { usersMembersUuidList.push(element) });
  var raw = JSON.stringify({
    usersMembersUuidList
  });

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(URL_link + "/project/" + localStorage.getItem('tokenOfProject') + "/add_members", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
    })
    .catch(error => console.log('error', error));
}
async function DeleteConsultant(tokenOfConsultant) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "usersConsultantsUuidList": [tokenOfConsultant]
  });

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(URL_link + "/project/" + localStorage.getItem('tokenOfProject') + "/delete_consultants", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
    })
    .catch(error => console.log('error', error));
}
async function DeleteMember(tokenOfMember) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem('token'));
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "usersMembersUuidList": [tokenOfMember]
  });

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(URL_link + "/project/" + localStorage.getItem('tokenOfProject') + "/delete_members", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
    })
    .catch(error => console.log('error', error));
}
//===================================================================================================//