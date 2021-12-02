async function addPPCard(token) {
    fetch("localhost:8080/project_proposal/get_all", token)
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
  function logOut(){
    localStorage.removeItem('token');
    document.location.href = "authorization.html";
  }