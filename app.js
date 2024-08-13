const $circle = document.querySelector("#circle");
const $score = document.querySelector("#score");
const $left = document.querySelector(".left");
const $all = document.querySelector(".all");
function start() {
  setScore(getScore());
  setImage();
  setEnergy(+$all.textContent)
}

function setScore(score) {
  localStorage.setItem("score", score);
  $score.textContent = score;
}

function setImage() {
  if (getScore() >= 50) {
    $circle?.setAttribute("src", "./assets/lizzard.png");
  }
}
if ($circle) {
  let MAX_ENERGY = +$all.textContent;
  const countOfEnergy = 3;

 

  function getScore() {
    return Number(localStorage.getItem("score")) ?? 0;
  }

  function addOne() {
    setScore(getScore() + 1);
    setImage();
  }

  function setEnergy(points) {
    localStorage.setItem("energy", points);
    $left.textContent = points;
  }
  function getEnergy() {
    return +localStorage.getItem("energy") ?? 10
  }

  function calcEnergy() {
    if (getEnergy() - 1 < 0) {
      setEnergy(0);
    } else {
      setEnergy(getEnergy() - 1);
    }
  }

  function amountEnergy() {
    if (getEnergy() + countOfEnergy < 10) {
      setEnergy(getEnergy() + countOfEnergy);
      $left.textContent = getEnergy();
    } else {
      if (getEnergy() == MAX_ENERGY) return;
      setEnergy(MAX_ENERGY);
      $left.textContent = getEnergy();
    }
  }

  setInterval(() => {
    amountEnergy();
  }, 3000);

  $circle.addEventListener("click", (event) => {
    if(getEnergy() > 0){
      const rect = $circle.getBoundingClientRect();
  
      const offfsetX = event.clientX - rect.left - rect.width / 2;
      const offfsetY = event.clientY - rect.top - rect.height / 2;
  
      const DEG = 40;
  
      const tiltX = (offfsetY / rect.height) * DEG;
      const tiltY = (offfsetX / rect.width) * -DEG;
  
      $circle.style.setProperty("--tiltX", `${tiltX}deg`);
      $circle.style.setProperty("--tiltY", `${tiltY}deg`);
  
      setTimeout(() => {
        $circle.style.setProperty("--tiltX", `0deg`);
        $circle.style.setProperty("--tiltY", `0deg`);
      }, 300);
  
      const plusOne = document.createElement("div");
      plusOne.classList.add("plus-one");
      plusOne.textContent = "+1";
      plusOne.style.left = `${event.clientX - rect.left}px`;
      plusOne.style.top = `${event.clientY - rect.top}px`;
  
      $circle.parentElement.appendChild(plusOne);
  
      addOne();
      calcEnergy();
      setTimeout(() => {
        plusOne.remove();
      }, 2000);
    }
  });

  start();
}

const marketItems = document.querySelectorAll(".market-item");
if (marketItems.length > 0) {
  marketItems.forEach((item) => {
    const upLvl = item.querySelector(".market-item__cost");
    upLvl.addEventListener("click", (e) => {
      alert("click");
    });
  });
}
