async function checkToken() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const status = await fetch("http://localhost:8080/user/self", requestOptions)
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

//Загружает информацию о пользователе на странице личного кабинета
async function LoadInformationOfUser() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("http://localhost:8080/user/self", requestOptions)
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
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка LoadInformationOfUser');
    });
}
//Загружает информацию о проектах на странице личного кабинета
async function LoadAllProjectsOfUser() {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", sessionStorage.getItem('token'));

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("http://localhost:8080/user/self", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Ошибочный запрос');
      }
      return response.json();
    })
    .then((result) => {
      let container = document.querySelector("#projects-list");
      for (var i = 0; i < Object.keys(result['projectUuidList']).length; i++) {
        let liElement = document.createElement('li');
        liElement.insertAdjacentHTML('beforeend', '<a href="project.html">Проект</a>');
        container.appendChild(liElement);
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка LoadAllProjectsOfUser');
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

  await fetch("http://localhost:8080/project_proposal/get_all", requestOptions)
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
          var k = newProposalCard(response['name'], response['id']);
        });
      }
    })
    .catch(error => {
      console.log('error', error);
      alert('Ошибка LoadAllProposals');
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

  const response = await fetch("http://localhost:8080/project_proposal/" + tokenOfProposal, requestOptions)
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
      alert('Ошибка LoadInformationAboutProposal');
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

  fetch("http://localhost:8080/project_proposal/" + proposalId, requestOptions)
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
    alert('Ошибка LoadInformationAboutProposal');
  });
}