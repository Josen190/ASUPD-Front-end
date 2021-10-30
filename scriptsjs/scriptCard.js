function addComent(){
  if ('content' in document.createElement('template')) {
    let template = document.getElementById("tempComment");
    let clone = template.content.cloneNode(true);
    let listComent = document.getElementById("commentList");
    listComent.appendChild(clone);
  }
}
