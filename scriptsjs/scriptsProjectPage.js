function SaveStatusFunction(){

    let radios = document.getElementsByName('flexRadioStatus');

    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        document.getElementById('inputStatus').value = radios[i].value;

        break;
      }
    }
}


function hasClass(ele,cls) {
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}


function addClass(id,cls) {
  ele = document.getElementById(id);
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}

function removeClass(id,cls) {
  ele = document.getElementById(id);
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}
