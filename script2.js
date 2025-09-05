  const bgMusic = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");
/*
  “Questo codice aspetta che la pagina sia completamente caricata prima di fare qualsiasi cosa. 
  Poi prende due elementi dalla pagina: uno è la musica di sfondo, l’altro è il pulsante per controllarla. 
  In questo modo possiamo usare il pulsante per far partire o fermare la musica senza problemi.”
  */
// Selettori
const profileBtn = document.getElementById('profile-btn');
const userMenu = document.getElementById('user-menu');

// Mostra/Nasconde il menu al click
profileBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Impedisce che il click chiuda subito il menu
  userMenu.classList.toggle('hidden');
});

// Chiude il menu se clicchi fuori
document.addEventListener('click', () => {
  if (!userMenu.classList.contains('hidden')) {
    userMenu.classList.add('hidden');
  }
});

  /*==================================================================================================*/
/*funzione per far partire l audio e farlo ripartire d accapo*/
  let deveRipartireDaCapo = false;

  if (musicBtn && bgMusic) {
    musicBtn.addEventListener("click", () => {
      if (bgMusic.paused) {
        if (deveRipartireDaCapo) {
          bgMusic.currentTime = 0; // 🔄 riparte sempre da capo dopo la pausa
        }
        bgMusic.play()
          .then(() => {
            deveRipartireDaCapo = true;
            musicBtn.classList.add("active"); // bordo giallo
          })
          .catch(e => console.error("Errore riproduzione audio:", e));
      } else {
        bgMusic.pause();
        deveRipartireDaCapo = true;
        musicBtn.classList.remove("active"); // togli bordo giallo
      }
    });
  }
  /* La variabile deveRipartireDaCapo serve a sapere se, quando si clicca di nuovo il pulsante, 
 la musica deve ripartire dall’inizio o meno. Il codice poi controlla che esistano sia il pulsante (musicBtn) 
 sia l’audio (bgMusic). Se esistono, aggiunge un event listener al pulsante in modo che ogni volta che viene cliccato 
succeda qualcosa.
Dentro la funzione del click, prima si controlla se la musica è in pausa. 
Se lo è e deveRipartireDaCapo è vero, allora l’audio viene riportato all’inizio (bgMusic.currentTime = 0) e poi parte con 
bgMusic.play(). 
Se la riproduzione parte correttamente, deveRipartireDaCapo 
viene impostato a true e al pulsante viene aggiunta una classe "active", 
che di solito serve a mostrare un bordo giallo o un effetto visivo.
Se invece la musica è già in riproduzione, allora viene messa in pausa con bgMusic.pause(), d
eveRipartireDaCapo resta true e la classe "active" viene rimossa dal pulsante, togliendo l’effetto visivo.
In pratica questo codice permette al pulsante di avviare, mettere in pausa e far ripartire la musica dall’inizio ogni 
volta che serve, e di aggiornare il pulsante visivamente in base allo stato della riproduzione.*/
/*==================================================================================================*/
  // Mobile menu
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
  /*Questa parte serve a far funzionare il menu sui dispositivi mobili. Quando clicchi sul pulsante del menu, 
  questo appare o scompare perché viene aggiunta o tolta la classe "hidden"..*/

  //API
  
  // ==========================================
// Funzione per popolare una lista
// ==========================================
// ==========================================
// Funzione per popolare una lista
// ==========================================
function populateList(container, data){
  container.innerHTML = "";
  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "p-4 bg-yellow-400/10 border border-yellow-400 rounded-xl shadow-md";
    div.innerHTML = `
      <h3 class="font-bold text-xl">${item.name}</h3>
      <p>${item.description || "Descrizione non disponibile."}</p>
    `;
    container.appendChild(div);
  });
}

// ==========================================
// Lista statica di isole del Grande Blu
// ==========================================
const grandBlueFallback = [
  {name:"Loguetown", description:"Isola dove è iniziata e finita la storia di Gol D. Roger."},
  {name:"Whiskey Peak", description:"Isola famosa per la trappola dei cacciatori di taglie."},
  {name:"Little Garden", description:"Isola preistorica abitata da giganti e dinosauri."},
  {name:"Drum Island", description:"Isola coperta di neve, famosa per i medici esperti."},
  {name:"Alabasta", description:"Grande regno desertico sotto il dominio del re Cobra."},
  {name:"Jaya", description:"Isola con pirati e leggende, punto di partenza per Skypiea."},
  {name:"Skypiea", description:"Isola nel cielo, ricca di storia e misteri."},
  {name:"Water 7", description:"Città-isola famosa per i cantieri navali e i carpentieri."},
  {name:"Enies Lobby", description:"Isola fortezza della Marina, collegata a Water 7."},
  {name:"Thriller Bark", description:"Isola-zombie governata da Gecko Moria."},
  {name:"Sabaody Archipelago", description:"Arcipelago con bolle di aria e pirati, vicino al Nuovo Mondo."},
  {name:"Fishman Island", description:"Isola sottomarina abitata dagli uomini-pesce."},
  {name:"Punk Hazard", description:"Isola divisa tra fuoco e ghiaccio, laboratorio segreto."},
  {name:"Dressrosa", description:"Isola governata da Donquixote Doflamingo, famosa per il torneo di gladiatori."},
  {name:"Zou", description:"Grande elefante vivente su cui si trova un’intera isola."}
];

// ==========================================
// Fetch isole dal Grande Blu
// ==========================================
async function fetchIslands() {
  const islandsListEl = document.getElementById("islands-list");
  try {
    const res = await fetch("https://api.api-onepiece.com/v2/locates/en");
    const data = await res.json();

    // Filtra le isole (se presenti)
    const islands = data.filter(loc => loc.type && loc.type.toLowerCase() === "island");

    if (islands.length > 0) {
      populateList(islandsListEl, islands);
    } else {
      // Usa fallback
      populateList(islandsListEl, grandBlueFallback);
    }

  } catch(e) {
    console.error("Errore API isole, uso dati di esempio", e);
    populateList(islandsListEl, grandBlueFallback);
  }
}

// ==========================================
// Scroll continuo lento
// ==========================================
function continuousScroll(container, content, speed = 0.2){
  let top = 0;
  content.style.position = "relative";

  function scrollStep(){
    top += speed;
    if(top >= content.scrollHeight) top = -container.clientHeight;
    content.style.top = -top + "px";
    requestAnimationFrame(scrollStep);
  }

  scrollStep();
}

// ==========================================
// Avvio
// ==========================================
fetchIslands();

// Scroll lento
const islandsContainer = document.getElementById("islands-list").parentElement;
const islandsListEl = document.getElementById("islands-list");
continuousScroll(islandsContainer, islandsListEl, 0.5);

