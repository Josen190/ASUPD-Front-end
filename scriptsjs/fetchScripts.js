var URL_link = "http://localhost:8080";

async function checkToken() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));
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
      sessionStorage.setItem('token', result);
      document.location.href = "account.html"
    })
    .catch(error => console.log('error', error))
}

//Загружает информацию о пользователе на странице личного кабинета
async function LoadInformationOfUser() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(URL_link + "/user/self", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      document.getElementById('full_name').innerText = result['lastName'] + ' ' + result['firstName'] + ' ' + result['patronymic'];
      document.getElementById('work_place').innerText += ': ' + result['workPlace'];
      document.getElementById('status').innerText += ': ' + result['status'];
      document.getElementById('birthday').innerText += ': ' + result['birthDate'];
      document.getElementById('phone').innerText += ': ' + result['phoneNumber'];

      let container = document.querySelector("#projects-list");
      for (var i = 0; i < Object.keys(result['projectUuidList']).length; i++) {
        let liElement = document.createElement('li');
        liElement.insertAdjacentHTML('beforeend', '<div class = "tempObject">' + result['projectUuidList'][i] + '</div>');
        liElement.dataset.uuidOfProject = result['projectUuidList'][i];
        liElement.addEventListener('click', () => {
          sessionStorage.setItem('tokenOfProject', liElement.dataset.uuidOfProject);
          document.location.href = "project.html";
        });

        container.appendChild(liElement);
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadInformationOfUser');
    });
}

//Загружает предложения в банке проектов 
async function LoadAllProposals() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));

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
      let proposalsArray = Object.keys(result).length;
      for (var i = 0; i < Object.keys(result).length; i++) {
        await LoadInformationAboutProposal(result[i]).then((response) => {
          newProposalCard(response['name'], response['id']);
        });
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadAllProposals');
    });
}

async function LoadInformationAboutProposal(tokenOfProposal) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));

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
  myHeaders.append("Authorization", sessionStorage.getItem('token'));

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
      document.location.href = "account.html";
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadInformationAboutProposal');
    });
}

async function LoadProjectInformation() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch(URL_link + '/project/' + sessionStorage.getItem('tokenOfProject'), requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      document.querySelector('#nameOfProject').value = result['name'];
      switch (result['projectStatus']) {
        case 'IN_PROCESS':
          document.querySelector('#inputStatus').value = 'В процессе';
          break;
        case 'FROZEN':
          document.querySelector('#inputStatus').value = 'Заморожен';
          break;
        case 'DONE':
          document.querySelector('#inputStatus').value = 'Выполнен';
          break;
        default:
          break;
      }
      document.querySelector('#userCaptain').innerText += " " + result['userCaptain'];
      document.querySelector('#projectManager').innerText += " " + result['projectManager'];

      for (var i = 0; i < Object.keys(result['stageUuidList']).length; i++) {
        LoadStagesOfProject(result['stageUuidList'][i], sessionStorage.getItem('tokenOfProject'));
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadProjectFunction');
    });
  return response;
}

async function LoadStagesOfProject(tokenOfStage) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(URL_link + '/stage/' + tokenOfStage + '?projectUuid=' + sessionStorage.getItem('tokenOfProject'), requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      addListForCards(result['name'], result['id']);
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка в LoadStagesOfProject');
    });
}

async function DeleteStage(tokenOfStage) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch(URL_link + '/stage/' + tokenOfStage + '?projectUuid=' + sessionStorage.getItem('tokenOfProject'), requestOptions)
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
  myHeaders.append("Authorization", sessionStorage.getItem('token'));
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

  const response = await fetch(URL_link + '/stage?projectUuid=' + sessionStorage.getItem('tokenOfProject'), requestOptions)
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