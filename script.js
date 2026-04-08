// ------------------- DANE -------------------
const data = {
  amnezja: { wet: 36, water: 5, fertilizer: 2, grindLvl: 1, potLvl: 2, points: 1, time: 120 },
  kush: { wet: 72, water: 10, water2: 5, fertilizer: 4, fertilizer2: 2, grindLvl: 3, potLvl: 4, points: 2, time: 120 },
  shaman: { wet: 132, water: 21, water2: 10, water5: 4, fertilizer: 8, grindLvl: 5, potLvl: 6, points: 4, time: 60 },
  mimosa: { wet: 360, water: 12, fertilizer: 3, grindLvl: 7, potLvl: 8, points: 8, time: 180 }
};

const vehicles = [
  { name: "Surfer", capacity: 30 },
  { name: "Moonbeam", capacity: 35 },
  { name: "Lost Slamvan", capacity: 35 },
  { name: "Guardian", capacity: 45 },
  { name: "Sandking", capacity: 45 },
  { name: "Volatus", capacity: 90 }
];

// ------------------- RESET -------------------
function resetCalculator() {
  document.getElementById("type").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("amount").placeholder = "np. 10";
  document.getElementById("result").innerHTML = "▶️ Wprowadź dane, aby zobaczyć wynik";
  document.getElementById("calculator-view").scrollIntoView({ behavior: "smooth" });
}

// ------------------- PRZEŁĄCZANIE WIDOKÓW -------------------
function showMap() {
  document.getElementById("calculator-view").style.display = "none";
  document.getElementById("map-view").style.display = "block";
}

function showCalculator() {
  document.getElementById("map-view").style.display = "none";
  document.getElementById("calculator-view").style.display = "block";
}

// ------------------- OBLICZENIA -------------------
function calculate() {
  const type = document.getElementById("type").value;
  const amount = parseInt(document.getElementById("amount").value);
  const resultDiv = document.getElementById("result");

  if (!type || !amount || amount <= 0) {
    resultDiv.innerHTML = "⚠️ Uzupełnij wszystkie pola!";
    return;
  }

  // Woda i nawóz
  let waterText="", fertilizerText="";
  if(type === "amnezja") { waterText = `${amount*data[type].water} x 1L`; fertilizerText = `${amount*data[type].fertilizer} x 0.3L`; }
  else if(type === "kush") { waterText = `${amount*data[type].water} x 1L<br>${amount*data[type].water2} x 2L`; fertilizerText = `${amount*data[type].fertilizer} x 0.3L<br>${amount*data[type].fertilizer2} x 0.6L`; }
  else if(type === "shaman") { waterText = `${amount*data[type].water} x1L<br>${amount*data[type].water2}x2L<br>${amount*data[type].water5}x5L`; fertilizerText = `${amount*data[type].fertilizer}x0.3L`; }
  else if(type === "mimosa") { waterText = `${amount*data[type].water} x 1L`; fertilizerText = `${amount*data[type].fertilizer} x0.3L`; }

  const wet = data[type].wet * amount;
  const dry = wet / 2; // 2 mokrego = 1 suchego
  const plotCount = Math.ceil(dry / 20);
  const plotText = `${plotCount} działka${plotCount>1?'i':''}`;

  const dryingTimeSeconds = (wet/2) * 5; // 5s na 2 mokrego

  const wetWeight = wet * 0.09;
  const dryWeight = dry * 0.09;

  let transportHtml = "";
  vehicles.forEach(v => {
    const tripsWet = Math.ceil(wetWeight / v.capacity);
    const tripsDry = Math.ceil(dryWeight / v.capacity);
    transportHtml += `<b>${v.name}</b> - Mokre: ${tripsWet} kursów, Suche: ${tripsDry} kursów<br>`;
  });

  const waterCost = amount*data[type].water*10;
  const fertilizerCost = amount*data[type].fertilizer*50;
  const totalCost = waterCost + fertilizerCost;
  const income = plotCount*1750;
  const profit = income - totalCost;

  resultDiv.innerHTML = `
    🌱 <b>${amount}</b> sadzonek<br>
    🎗️ Poziomy:<br>
    gruntowe: ${data[type].grindLvl} lvl<br>
    doniczkowe: ${data[type].potLvl} lvl<br><br>
    🥤 Woda:<br>${waterText}<br><br>
    ⛱️ Nawóz:<br>${fertilizerText}<br><br>
    ⏰ Czas uprawy: <b>${data[type].time} min</b><br>
    🌿 Plony:<br>
    mokre: <b>${wet}</b><br>
    suche: <b>${dry}</b><br>
    ⏳ Czas suszenia: <b>${dryingTimeSeconds} s</b><br>
    🏡 Działki: <b>${plotText}</b><br><br>
    🔹 Punkty umiejętności: <b>+${data[type].points * amount} plantWeed</b><br><br>
    ⚖️ Waga:<br>
    mokre: <b>${wetWeight.toFixed(2)} kg</b><br>
    suche: <b>${dryWeight.toFixed(2)} kg</b><br><br>
    🚗 Transport:<br>${transportHtml}
    <div style="text-align:center; margin-top:10px;">
      <button onclick="resetCalculator()" style="padding:10px 20px; border:none; border-radius:8px; background:#22c55e; color:white; cursor:pointer;">
        Wróć i wybierz inną odmianę
      </button>
    </div>
  `;
}

// ------------------- MAPA PRZESUWALNA -------------------
const mapImage = document.getElementById("map-image");
let isDragging = false;
let startX, startY, origX = 0, origY = 0;

mapImage.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  mapImage.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => { isDragging = false; mapImage.style.cursor = "grab"; });

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  mapImage.style.transform = `translate(${origX+dx}px, ${origY+dy}px)`;
});

mapImage.addEventListener("mouseup", () => {
  const style = mapImage.style.transform.match(/translate\(([-\d.]+)px, ([-\d.]+)px\)/);
  if(style){ origX = parseFloat(style[1]); origY = parseFloat(style[2]); }
});
