function calculate(){
  const type = document.getElementById("type").value;
  const amount = parseInt(document.getElementById("amount").value);
  const resultDiv = document.getElementById("result");

  if(!type || !amount || amount <= 0){
    resultDiv.innerHTML = "⚠️ Uzupełnij wszystkie pola!";
    return;
  }

  const data = {
    amnezja: {wet:36, points:1},
    kush: {wet:72, points:1},
    shaman: {wet:132, points:1},
    mimosa: {wet:360, points:1}
  };

  const wet = data[type].wet * amount;
  const dry = wet / 2; // 2 mokrego = 1 suchego
  const plots = Math.ceil(dry / 20);

  resultDiv.innerHTML = `
    🌱 ${amount} sadzonek<br>
    🌿 Plony: ${wet} mokrego / ${dry} suchego<br>
    🏡 Działki: ${plots} działka<br>
    Punkty umiejętności: +${data[type].points} plantWeed
  `;
}
