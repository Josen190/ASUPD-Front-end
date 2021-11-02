function lastEdit(userId = 'тест', data = '01.11.2021') {
  document.getElementById("lastData").innerHTML = "Последнее изменение: " + data;
  document.getElementById("lastUser").innerHTML = "Изменил: " + userId;
}


function newComentHTML(text, userId = 'тест', data = '01.11.2021'){
  if ('content' in document.createElement('template')) {
    let template = document.getElementById("tempComment");
    let clone = template.content.cloneNode(true);

    clone.getElementById("userCommen").innerHTML = userId;
    clone.getElementById("dataComment").innerHTML = data;
    clone.getElementById("contentComment").innerHTML = text;

    let listComent = document.getElementById("commentList");
    listComent.appendChild(clone);

    lastEdit(userId, data);
  }
}

function addComent(parent){
  let text = parent.getElementsByTagName('textarea')[0];


  if (text.value == ""){
    return;
  }

  newComentHTML(text.value);

  text.value = "";
}



function eidtContentCard(parent) {
  let btn = parent.querySelector(".mode").childNodes;
  btn[1].removeAttribute('disabled');
  btn[3].setAttribute('disabled', true);

  content = parent.querySelector('.filling');
  text = content.getElementsByTagName('textarea')[0];
  text.removeAttribute('disabled');

}

function viewingContentCard(parent) {
  let btn = parent.querySelector(".mode").childNodes;
  btn[1].setAttribute('disabled', true);
  btn[3].removeAttribute('disabled');

  content = parent.querySelector('.filling');
  text = content.getElementsByTagName('textarea')[0];
  text.setAttribute('disabled', true);

}