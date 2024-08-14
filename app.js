const $circle = document.querySelector("#circle");
const $score = document.querySelector("#score");
const $left = document.querySelector(".left");
const $all = document.querySelector(".all");

function start() {
  setScore(getScore());
  setImage();
  setProfitClick(getProfitClick())
  if($all){
    setEnergy(getEnergy())
  }
}

function setProfitClick(count){
  localStorage.setItem("clickProfit", count);
}

function getProfitClick(){
  return localStorage.getItem("clickProfit") ?? 1;
}

function setScore(score) {
  localStorage.setItem("score", Math.floor(score));
  $score.textContent = Math.floor(score);
}

function getScore() {
  return Number(localStorage.getItem("score")) ?? 0;
}

function setImage() {
  if (getScore() >= 50) {
    $circle?.setAttribute("src", "./assets/cat.png");
  }
}

function setEnergy(points) {
  localStorage.setItem("energy", points);
  $left.textContent = points;
}

function getEnergy() {
  return +localStorage.getItem("energy") ?? 10
}

let countOfEnergy = getProfitClick();

if ($circle) {
  let MAX_ENERGY = +$all.textContent;

  function addOne() {
    setScore(+getScore() + +countOfEnergy);
    setImage();
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
      plusOne.textContent = "+" + Math.floor(getProfitClick());
      plusOne.style.left = `${event.clientX - rect.left}px`;
      plusOne.style.top = `${event.clientY - rect.top}px`;
  
      $circle.parentElement.appendChild(plusOne);
  
      addOne();
      calcEnergy();
      setTimeout(() => {
        plusOne.remove();
      }, 2000);




      checkCosts()
    }
  });

}
start();

const marketItems = [...document.querySelectorAll(".market-item")];

if (marketItems.length > 0) {
  const marketItemsArr = []

  marketItems.forEach((item, idx) => {
    const upLvl = item.querySelector(".market-item__cost");

    

    const infoItem = {}
    infoItem.name = item.querySelector('.market-item__name').textContent.toLowerCase().trim()
    infoItem.cost = +item.querySelector('.market-item__cost span').textContent
    infoItem.lvl = +item.querySelector('.market-item__lvl span').textContent
    infoItem.isActive = infoItem.cost < getScore()
    
    setMarketItemsCosts(infoItem)

    if(!infoItem.isActive){
      addBoutghtClass(item)
    } else {
      removeBoutghtClass(item)

      if(infoItem.name == "boost"){
        upLvl.addEventListener('click', e => {

          
          setProfitClick(getProfitClick() * 1.2)
          setScore(getScore() - infoItem.cost)
          infoItem.lvl += 1
          infoItem.cost = +item.querySelector('.market-item__cost span').textContent * 2


          const newInfo = {
            name: marketItems[idx].name,
            cost: infoItem.cost,
            isActive: marketItems[idx].isActive,
            lvl: infoItem.lvl + 1,
          }
          marketItems.slice(idx, 1, newInfo)

          item.querySelector('.market-item__lvl span').textContent = infoItem.lvl
          item.querySelector('.market-item__cost span').textContent = item.querySelector('.market-item__cost span').textContent * 2
        })
      }
    }

    
  });

  function setMarketItemsCosts(item){
    marketItemsArr.push(item)
    localStorage.setItem('market-items', JSON.stringify(marketItemsArr))
  }
  
  function getMarketCosts(){
    return JSON.parse(localStorage.getItem('market-items')) ?? marketItemsArr;
  }
  
  function checkCosts(){
    const items = getMarketCosts()
    items.forEach(el => {
      if(el.cost < getScore()){
        el.isActive = false
      } else {
        el.isActive = true
      }
    })
  
    localStorage.setItem('market-items', JSON.stringify(items))
  }
}
function addBoutghtClass(item){
  item.classList.add('market__item--bought')
}
function removeBoutghtClass(item){
  item.classList.remove('market__item--bought')
}




