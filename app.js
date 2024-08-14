const $circle = document.querySelector("#circle");
const $score = document.querySelector("#score");
const $left = document.querySelector(".left");
const $all = document.querySelector(".all");

function start() {
  setScore(getScore());
  setImage();
  setProfitClick(getProfitClick())
  if($all){
    setEnergyLimit(getEnergyLimit())
    setEnergy(getEnergy())


    $all.textContent = Math.floor(getEnergyLimit())
  }
}

function setEnergyLimit(count){
  localStorage.setItem("energyLimit", count);
}
function getEnergyLimit(){
  return localStorage.getItem("energyLimit") ?? 10;
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
  $left.textContent = Math.floor(points);
}

function getEnergy() {
  return +localStorage.getItem("energy") ?? 10
}

let countOfEnergy = 3;

if ($circle) {
  let MAX_ENERGY = getEnergyLimit();

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
    if (getEnergy() + countOfEnergy < getEnergyLimit()) {
      setEnergy(getEnergy() + countOfEnergy);
    } else {
      if (getEnergy() == MAX_ENERGY) return;
      setEnergy(MAX_ENERGY);
    }
    $left.textContent = Math.floor(getEnergy());
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
    }
  });

}
start();

// const marketItems = [...document.querySelectorAll(".market-item")];
const marketList = document.querySelector('.market__list')
if (marketList) {
  const marketItemsArr = JSON.parse(localStorage.getItem('market-items')) ?? [
    {
      name: 'Boost',
      cost: 100,
      lvl: 1,
      isActive: false,
      desc: 'x1.4 к прибыли',
      id: Math.floor(Date.now() + Math.random() * 100)
    },
    {
      name: 'Energy',
      cost: 100,
      lvl: 1,
      isActive: false,
      desc: 'x1.2 к лимиту',
      id: Math.floor(Date.now() + Math.random() * 100)
    },
  ]
  function boostFunc(item){

    if( item.cost <= getScore()){

      setProfitClick(getProfitClick() * 1.2)
      setScore(getScore() -  item.cost)

      item.cost *= 2
      item.lvl += 1

      
    }
  }


  function energyFunc(item){
    if(item.cost < getScore()){

      setEnergyLimit(getEnergyLimit() * 1.4)
      setScore(getScore() - item.cost)

      item.lvl += 1
      item.cost *= 2

    }
  }

  marketList.addEventListener('click', e => {
    const parent = e.target.closest('.market-item');
    if(parent){
      const name = parent.querySelector('.market-item__name').textContent.trim().toLowerCase()
      const id = parent.dataset.id
      
      let position = -1;
      let item = marketItemsArr.find((item, i) => {
        if(item.id == id){
          position = i
          return true
        }
      })
      
      if(name == "boost") {
        boostFunc(item, position)
      }
      
      if(name == "energy") {
        energyFunc(item, position)
      }

      if(position != -1){
        replaceItem(item, position)
      }
      position = -1
      initItems()
    }
  })

  


  function replaceItem(item, position){
    marketItemsArr.slice(position, 1, item)
    localStorage.setItem('market-items', JSON.stringify(marketItemsArr))
  }

  function setMarketItemsCosts(item){
    marketItemsArr.push(item)
    localStorage.setItem('market-items', JSON.stringify(marketItemsArr))
  }
  localStorage.setItem('market-items', JSON.stringify(marketItemsArr))
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

  function initItems(){
    const items = JSON.parse(localStorage.getItem('market-items'))
    

    const html = items.map(item => {
      return `
        <li class="market__item market-item" data-id="${item.id}">
            <div class="market-item__top">
              <div class="market-item__icon">
                <img src="./assets/lvlmarket.jpg" alt="" />
              </div>
              <div class="market-item__about">
                <div class="market-item__name">${item.name}</div>
                <div class="market-item__desc">${item.desc}</div>
              </div>
            </div>
            <div class="market-item__bottom">
              <div class="market-item__lvl">lvl <span>${item.lvl}</span></div>
              <div class="market-item__cost">
                <img src="./assets/coin.png" alt="" />
                <span>${item.cost}</span>
              </div>
            </div>
          </li>
      `
    }).join('\n')
    marketList.innerHTML = html
  }
initItems()
}
function addBoutghtClass(item){
  item.classList.add('market__item--bought')
}
function removeBoutghtClass(item){
  item.classList.remove('market__item--bought')
}




