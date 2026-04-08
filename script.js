const typeSelect = document.getElementById("type");
const amountInput = document.getElementById("amount");
const resultDiv = document.getElementById("result");

// Maksymalne ilości dla odmian
typeSelect.addEventListener("change", function(){
  switch(this.value){
    case "amnezja": amountInput.max=100; amountInput.placeholder="Ilość (max 100)"; break;
    case "kush": amountInput.max=50; amountInput.placeholder="Ilość (max 50)"; break;
    case "shaman": amountInput.max=25; amountInput.placeholder="Ilość (max 25)"; break;
    case "mimosa": amountInput.max=12; amountInput.placeholder="Ilość (max 12)"; break;
    default: amountInput.removeAttribute("max"); amountInput.placeholder="Ilość sadzonek";
  }
});

function calculate(){
  const type = typeSelect.value;
  const amount = parseInt(amountInput.value);
  if(!type || !amount || amount<=0){ resultDiv.innerHTML="⚠️ Uzupełnij wszystkie pola!"; return; }

  // Odmiany i parametry
  const data = {
    amnezja:{wet:36, dry:18, water:5, fertilizer:2, grindLvl:1, potLvl:2, points:1, time:120},
    kush:{wet:72, dry:36, water:10, water2:5, fertilizer:4, fertilizer2:2, grindLvl:3, potLvl:4, points:1, time:120},
    shaman:{wet:132, dry:66, water:21, water2:10, water5:4, fertilizer:8, grindLvl:5, potLvl:6, points:1, time:60},
    mimosa:{wet:360, dry:180, water:12, fertilizer:3, grindLvl:7, potLvl:8, points:1, time:180}
  };

  // Woda i nawóz
  let waterText="", fertilizerText="";
  if(type==="amnezja"){waterText=`${amount*data[type].water} x 1L`; fertilizerText=`${amount*data[type].fertilizer} x 0.3L`;}
  else if(type==="kush"){waterText=`${amount*data[type].water} x1L<br>${amount*data[type].water2} x2L`; fertilizerText=`${amount*data[type].fertilizer} x0.3L<br>${amount*data[type].fertilizer2} x0.6L`;}
  else if(type==="shaman"){waterText=`${amount*data[type].water} x1L<br>${amount*data[type].water2} x2L<br>${amount*data[type].water5} x5L`; fertilizerText=`${amount*data[type].fertilizer} x0.3L`;}
  else if(type==="mimosa"){waterText=`${amount*data[type].water} x1L`; fertilizerText=`${amount*data[type].fertilizer} x0.3L`; }

  // Plony
  let wet = data[type].wet * amount;
  let dry = wet / 2; // 2 mokrego = 1 suchego

  // Liczba działek
  let plots = Math.ceil(dry/20);

  // Waga transportu (100 mokrego = 50 suchego = 10kg)
  const vehicles = [
    {name:"Surfer", capacity:30},
    {name:"Moonbeam", capacity:35},
    {name:"Lost Slamvan", capacity:35},
    {name:"Guardian", capacity:45},
    {name:"Sandking", capacity:45},
    {name:"Volatus", capacity:90}
  ];

  let tripsWet = vehicles.map(v => ({name:v.name, trips:Math.ceil((wet*0.09)/v.capacity)}));
  let tripsDry = vehicles.map(v => ({name:v.name, trips:Math.ceil((dry*0.09)/v.capacity)}));

  // Koszty
  let waterCost = amount*data[type].water*10;
  let fertilizerCost = amount*data[type].fertilizer*50;
  let totalCost = waterCost + fertilizerCost;

  // Sprzedaż - tylko dealer dla uproszczenia
  let dealerPrice = 1750;
  let income = plots * dealerPrice;
  let profit = income - totalCost;

  // Wyświetlanie wyniku
  resultDiv.innerHTML = `
    🌱 <b>${amount}</b> sadzonek<br>
    🎗️ Poziomy umiejętności:<br>
    gruntowe: ${data[type].grindLvl} lvl<br>
    doniczkowe: ${data[type].potLvl} lvl<br>
    Punkty umiejętności: +${data[type].points} plantWeed<br><br>
    🥤 Woda:<br>${waterText}<br><br>
    ⛱️ Nawóz:<br>${fertilizerText}<br><br>
    ⏰ Czas uprawy: <b>${data[type].time} min</b><br>
    🌿 Plony: <b>${wet} mokrego / ${dry} suchego</b><br>
    🏡 Działki: <b>${plots} działka</b><br><br>
    ⚖️ Transport:<br>
    ${tripsWet.map(v=>`Mokre - ${v.name}: ${v.trips} kursów`).join('<br>')}<br>
    ${tripsDry.map(v=>`Suche - ${v.name}: ${v.trips} kursów`).join('<br>')}<br><br>
    💰 Sprzedaż (Dealer): <b>${income}$</b><br>
    💸 Koszty: Woda ${waterCost}$, Nawóz ${fertilizerCost}$, Razem ${totalCost}$<br>
    🔥 Zysk na czysto: <b style="color:${profit>=0?'lime':'red'}">${profit}$</b>
  `;
}
