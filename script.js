document.addEventListener("DOMContentLoaded", () => {
  const bgMusic = document.getElementById("bg-music");
  const musicBtn = document.getElementById("music-btn");
/*
  “Questo codice aspetta che la pagina sia completamente caricata prima di fare qualsiasi cosa. 
  Poi prende due elementi dalla pagina: uno è la musica di sfondo, l’altro è il pulsante per controllarla. 
  In questo modo possiamo usare il pulsante per far partire o fermare la musica senza problemi.”
  */

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
  // Flip cards
  document.querySelectorAll(".flip-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const container = btn.closest(".card-container");
      const card = container.querySelector(".flip-card");
      card.classList.toggle("flipped");
      btn.textContent = btn.textContent === "Follow" ? "Unfollow" : "Follow";
  /*Questa parte serve a far funzionare le card interattive. Per ogni pulsante con la classe "flip-btn", quando viene cliccato, la card corrispondente si gira (aggiungendo o togliendo la classe "flipped") e il testo del pulsante cambia: se prima era "Follow" diventa "Unfollow" e viceversa. In pratica, 
  clicchi sul pulsante e la card si capovolge mostrando il retro,
   e il pulsante aggiorna subito il suo testo.*/

    /*==================================================================================================*/
      // Suono flip
      const flipSound = document.getElementById("suono-giro");
      if (flipSound) {
        flipSound.currentTime = 0;
        flipSound.play();
      }
    });
  });
});
/*Questa parte aggiunge un effetto sonoro quando la card si gira. Prende l’elemento audio con id="suono-giro" 
e, se esiste, lo riporta all’inizio (currentTime = 0) e lo fa partire (play()). 
In pratica, ogni volta che clicchi sul pulsante della card, 
oltre a girarla e cambiare il testo, viene anche riprodotto un suono di giro.*/

  // ==========================
  // 🎯 API One Piece
  // ==========================
  
  document.addEventListener("DOMContentLoaded", () => {
  const fruitsListEl = document.getElementById("fruits-list");
  const crewListEl = document.getElementById("crew-list");
  const fruitsContainer = document.getElementById("fruits-container");
  const crewContainer = document.getElementById("crew-container");

  // Funzione per popolare liste
  function populateList(container, items){
    container.innerHTML = "";
    items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.name;
      li.className = "p-2 bg-black/30 rounded text-yellow-200 font-semibold shadow text-center";
      container.appendChild(li);
    });
  }

  // ==========================
  // 🎯 API One Piece
  // ==========================
  async function fetchFruits(){
    try {
      const res = await fetch("https://api.api-onepiece.com/v2/fruits/en");
      const data = await res.json();
      populateList(fruitsListEl, data);
    } catch(e){
      console.error("Errore API frutti, uso dati di esempio", e);
      const fruitsData = [
        {name:"Gomu Gomu no Mi"}, {name:"Mera Mera no Mi"},
        {name:"Hito Hito no Mi"}, {name:"Suna Suna no Mi"},
        {name:"Goro Goro no Mi"}, {name:"Ope Ope no Mi"},
        {name:"Yami Yami no Mi"}, {name:"Gura Gura no Mi"}
      ];
      populateList(fruitsListEl, fruitsData);
    }
  }

  async function fetchCrew(){
    try {
      const res = await fetch("https://api.api-onepiece.com/v2/crews/en");
      const data = await res.json();
      populateList(crewListEl, data);
    } catch(e){
      console.error("Errore API crew, uso dati di esempio", e);
      const crewData = [
        {name:"Monkey D. Luffy"}, {name:"Roronoa Zoro"}, {name:"Nami"},
        {name:"Usopp"}, {name:"Sanji"}, {name:"Tony Tony Chopper"},
        {name:"Nico Robin"}, {name:"Franky"}, {name:"Brook"}, {name:"Jinbe"}
      ];
      populateList(crewListEl, crewData);
    }
  }

  fetchFruits();
  fetchCrew();
/* Ci sono due funzioni asincrone: fetchFruits() e fetchCrew(). 
La funzione fetchFruits() prova a prendere una lista di frutti da un’API online. Usa await fetch(...) 
per richiedere i dati e poi li converte in formato JSON con res.json(). 
Se la richiesta va a buon fine, i dati vengono passati alla funzione populateList() 
per mostrarli nella pagina. 
Se invece c’è un errore (ad esempio l’API non risponde), 
viene eseguito il blocco catch, che stampa l’errore sulla console e usa una lista di frutti di esempio già presenti nel codice, 
in modo che la pagina continui a funzionare.
La funzione fetchCrew() fa la stessa cosa, ma per la lista dei membri della ciurma. Anche qui, 
se l’API fallisce, viene usata una lista di personaggi di esempio.
Alla fine, le due funzioni vengono chiamate con fetchFruits() e fetchCrew(),
 quindi appena la pagina viene caricata vengono recuperati i dati sia dei frutti sia della ciurma, 
 mostrando sempre qualcosa anche in caso di problemi con le API.*/

  // ==========================
  // Scroll continuo lento
  // ==========================
  function continuousScroll(container, content, speed = 0.2){
    let top = 0;

    function scrollStep(){
      top += speed;
      if(top >= content.scrollHeight) top = -container.clientHeight; // riparte dall'alto
      content.style.top = -top + "px";
      requestAnimationFrame(scrollStep);
    }

    scrollStep();
  }

  continuousScroll(fruitsContainer, fruitsListEl, 0.5);
  continuousScroll(crewContainer, crewListEl, 0.5);
});

/*La funzione continuousScroll() serve a far scorrere automaticamente il contenuto di un contenitore verso l’alto, come un ticker verticale. 
Prende tre parametri: container (l’elemento che contiene lo scorrimento), content (l’elemento che scorre) 
e speed (la velocità dello scorrimento, con un valore predefinito di 0.2).
 All’interno, una variabile top tiene traccia di quanto il contenuto è stato spostato. 
 La funzione interna scrollStep() aumenta top ad ogni frame, e se il contenuto è arrivato in fondo, 
 lo riporta in cima impostando top a un valore negativo pari all’altezza del contenitore, 
 così lo scorrimento riparte dall’alto in loop continuo. Infine requestAnimationFrame(scrollStep) 
 fa sì che la funzione venga richiamata in modo fluido a ogni frame.
Alla fine, la funzione viene chiamata due volte: una per far scorrere i frutti (fruitsContainer)
 e una per la ciurma (crewContainer), entrambe con velocità 0.5, così il contenuto di entrambe 
 le liste scorre continuamente verso l’alto.*/

 