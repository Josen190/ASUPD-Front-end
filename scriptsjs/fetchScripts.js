async function checkToken() {
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
        .catch(error => {
            console.log('error', error);
            alert('Нет токена');
            document.location.href = "authorization.html"
        });
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
        document.getElementById('full_name').innerText =  result['lastName'] + ' ' + result['firstName'] + ' ' + result['patronymic'];
        document.getElementById('work_place').innerText += ': ' + result['workPlace'];
        document.getElementById('status').innerText += ': ' + result['status'];
        document.getElementById('birthday').innerText += ': ' + result['birthDate'];
        document.getElementById('phone').innerText += ': ' + result['phoneNumber'];
      })
      .catch(error => {
        console.log('error', error);
        alert('Нет токена');
        document.location.href = "authorization.html"
      });
  }
