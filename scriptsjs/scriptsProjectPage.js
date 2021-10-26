function SaveStatusFunction(){
    
    var radios = document.getElementsByName('flexRadioStatus');

    for (var i = 0, length = radios.length; i < length; i++) {
      if (radios[i].checked) {
        document.getElementById('inputStatus').value = radios[i].value;
    
        break;
      }
    }
}