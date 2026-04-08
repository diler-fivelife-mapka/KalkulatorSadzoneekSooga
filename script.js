function toggleTheme() {
  document.body.classList.toggle("light");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

const typeSelect = document.getElementById("type");
const amountInput = document.getElementById("amount");

typeSelect.addEventListener("change", function () {
  switch (this.value) {
    case "amnezja": amountInput.max = 100; break;
    case "kush": amountInput.max = 50; break;
    case "shaman": amountInput.max = 25; break;
    case "mimosa": amountInput.max = 12; break;
    default: amountInput.removeAttribute("max");
  }
});

function calculate() {
  const type = typeSelect.value;
  const amount = parseInt(amountInput.value);
  const resultDiv = document.getElementById("result");

  if (!type || !amount || amount <= 0) {
    resultDiv.innerHTML = "⚠️ Uzupełnij wszystkie pola!";
    return;
  }

  if (
    (type === "amnezja" && amount > 100) ||
    (type === "kush" && amount > 50) ||
    (type === "shaman" && amount > 25) ||
    (type === "mimosa" && amount > 12)
  ) {
    resultDiv.innerHTML = "❌ Przekroczono limit sadzonek!";
    return;
  }

  // 🌱 DANE SADZONEK
  const data = {
    amnezja: { wet: 36, water: 5, fertilizer: 2, grindLvl: 1, potLvl: 2, points: 1, time: 120 },
    kush: { wet: 72, water: 10, water2: 5, fertilizer: 4, fertilizer2: 2, grindLvl: 3, potLvl: 4, points: 2, time: 120 },
    shaman: { wet: 132, water: 21, water2: 10, water5: 4, fertilizer: 8, grindLvl: 5, potLvl: 6, points: 4, time: 60 },
    mimosa: { wet: 360, water: 12, fertilizer: 3, grindLvl: 7, potLvl: 8, points: 8, time: 180 }
  };

  let waterText = "";
  let fertilizerText = "";

  if (type === "amnezja") {
    waterText = `${amount * data[type].water} x 1L`;
    fertilizerText = `${amount * data[type].fertilizer} x 0.3L`;
  } else if (type === "kush") {
    waterText = `${amount * data[type].water} x 1L<br>${amount * data[type].water2} x 2L`;
    fertilizerText = `${amount * data[type].fertilizer} x 0.3L<br>${amount * data[type].fertilizer2} x 0.6L`;
  } else if (type === "shaman") {
    waterText = `${amount * data[type].water} x 1L<br>${amount * data[type].water2} x 2L<br>${amount * data[type].water5} x 5L`;
    fertilizerText = `${amount * data[type].fertilizer} x 0.3L`;
  } else if (type === "mimosa") {
    waterText = `${amount * data[type].water} x 1L`;
    fertilizerText = `${amount * data[type].fertilizer} x 0.3L`;
  }

  // 🌾 PLONY
  let wet = data[type].wet * amount;
  let dry = wet / 2; // mokre → suche

  // ⚖️ WAGA (1 jednostka = 0.1 kg)
  let wetWeight = wet * 0.1;
  let dryWeight = dry * 0.1;

  // 🚗 AUTA
const vehicles = [
  { name: "Surfer", capacity: 30 },
  { name: "Moonbeam", capacity: 35 },
  { name: "Lost Slamvan", capacity: 35 },
  { name: "Guardian", capacity: 45 },
  { name: "Sandking", capacity: 45 },
  { name: "Volatus", capacity: 90 }
];

  // Oblicz kursy dla każdego auta
  let transportHtml = "";
  vehicles.forEach(v => {
    const tripsWet = Math.ceil(wetWeight / v.capacity);
    const tripsDry = Math.ceil(dryWeight / v.capacity);
    transportHtml += `
      <b>${v.name} (${v.capacity} kg)</b><br>
      Mokre: ${wetWeight.toFixed(2)} kg → <b>${tripsWet}</b> kursów<br>
      Suche: ${dryWeight.toFixed(2)} kg → <b>${tripsDry}</b> kursów<br><br>
    `;
  });

  // Wyświetlenie wyników
  resultDiv.innerHTML = `
    🌱 <b>${amount}</b> sadzonek<br><br>

    🎗️ Poziomy:<br>
    gruntowe: <b>${data[type].grindLvl}</b><br>
    doniczkowe: <b>${data[type].potLvl}</b><br><br>

    🥤 Woda:<br>${waterText}<br><br>

    🌿 Nawóz:<br>${fertilizerText}<br><br>

    ⏰ Czas: <b>${data[type].time} min</b><br><br>

    🌾 Plony:<br>
    mokre: <b>${wet}</b><br>
    suche: <b>${dry}</b><br><br>

    🔹 Punkty umiejętności:<br>
    <b>+${data[type].points * amount} plantWeed</b><br><br>

    <hr style="opacity:0.2">

    🚗 Transport:<br><br>
    ${transportHtml}
  `;
}
