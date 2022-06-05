// Makes colors for section and type
// const colorsForElements = document.querySelectorAll('.container__colorAndTypes--color');

// colorsForElements.forEach(function(elem,index) {
//     if (index == 0) {
//         elem.style.backgroundColor = 'rgba(31, 32, 65, 1)';
//     } else if (index == 1){
//         elem.style.backgroundColor = 'rgba(31, 32, 65, 0.75)';
//     } else if (index == 2){
//         elem.style.backgroundColor = 'rgba(31, 32, 65, 0.5)';
//     } else if (index == 3){
//         elem.style.backgroundColor = 'rgba(31, 32, 65, 0.25)';
//     } else if (index == 4){
//         elem.style.backgroundColor = 'rgba(31, 32, 65, 0.05)';
//     } else if (index == 5){
//         elem.style.backgroundColor = 'rgba(188, 156, 255, 1)';
//     } else if (index == 6){
//         elem.style.backgroundColor = 'rgba(111, 207, 151, 1)';
//     }
// });

//burger menu
const burgerCont = document.querySelector('#burger');
const burgerSpanfirst = document.querySelector('.burger__line--first');
const burgerSpanSecond = document.querySelector('.burger__line--second');
const burgerSpanThird = document.querySelector('.burger__line--third');

burgerCont.addEventListener('click', openBurger);

function openBurger() {
    burgerSpanSecond.style.display = 'none';
    burgerSpanfirst.style.marginTop = '7px';
    burgerSpanfirst.style.transform = 'rotate(0.35turn)';
    burgerSpanThird.style.transform = 'rotate(0.15turn)';
    burgerSpanThird.style.marginTop = '-9px';
}

//Dropdown content for section choise sum of beds, bathrooms 
let count = 0;
document.querySelector('.dropDown__button').addEventListener('click', () => {  
    let topBlock = document.querySelector('.dropDown__sectionWithDropdownContent');
    if (count % 2 == 0){
        topBlock.style.marginTop = '0';
        topBlock.style.display = 'block';
        count++;
    }
    else {
        topBlock.style.display = 'none';
        count--;
    }
});

//Dropdown content for section choise checkbox with guests 
//calck of bedrooms
let plusRectangelBedrooms = document.querySelectorAll('.dropDown__sectionWithDropdownContent--RectatanglePlus');
let rectanglPBedrooms = document.querySelectorAll('.dropDown__sectionWithDropdownContent--Number');
let minusRectangelBedrooms = document.querySelectorAll('.dropDown__sectionWithDropdownContent--RectatangleMinus');

let rectCountBedrooms = [0, 0, 0];

const sumOfBedrooms = document.querySelector('.dropdownSectionGuests__button--apply');


plusRectangelBedrooms.forEach (function(elem, index) {
    elem.addEventListener('click', () => {
        if (index == 0) {
            if(rectanglPBedrooms[0].innerHTML < 10){
                rectanglPBedrooms[0].innerHTML = ++rectCountBedrooms[0];
            } else {
                return;
            }
        }
        else if (index == 1) {
            if(rectanglPBedrooms[1].innerHTML < 10){
                rectanglPBedrooms[1].innerHTML = ++rectCountBedrooms[1];
            } else {
                return;
            }
        }
        else {
            if(rectanglPBedrooms[2].innerHTML < 10){
                rectanglPBedrooms[2].innerHTML = ++rectCountBedrooms[2];
            } else {
                return;
            }
        }
    });
    
});

minusRectangelBedrooms.forEach (function(elem, index) {
    elem.addEventListener('click', () => {
        if (index == 0) {
            if(rectanglPBedrooms[0].innerHTML > 0){
                rectanglPBedrooms[0].innerHTML = --rectCountBedrooms[0];
            } else {
                return;
            }
            
        }
        else if (index == 1) {
            if(rectanglPBedrooms[1].innerHTML > 0){
                rectanglPBedrooms[1].innerHTML = --rectCountBedrooms[1];
            } else {
                return;
            }
        }
        else {
            if(rectanglPBedrooms[2].innerHTML > 0){
                rectanglPBedrooms[2].innerHTML = --rectCountBedrooms[2];
            } else {
                return;
            }
        }
        
    });
});


sumOfBedrooms.addEventListener('click', () => {
    for (i=0; i<rectanglPBedrooms.length; i++) {
        console.log(rectanglPBedrooms[i].innerHTML);
    }
});



//Dropdown content for section choise checkbox with breackfast
let countButtonCheckBox = 0;
document.querySelector('.choiseCheckbox__button').addEventListener('click', () => {  
    let checkBoxBlock = document.querySelector('.choicseListOfCheckBoxes');
    if (countButtonCheckBox % 2 == 0){
        checkBoxBlock.style.marginTop = '0';
        checkBoxBlock.style.display = 'block';
        countButtonCheckBox++;
    }
    else {
        checkBoxBlock.style.display = 'none';
        countButtonCheckBox--;
    }
});

//Dropdown content for section choise checkbox with guests
let countGuestSection = 0;
document.querySelector('.dropdownSectionGuests__button').addEventListener('click', () => {  
    let topBlockGuests = document.querySelector('.dropdownSectionGuests__sectionWithDropdownContent');
    if (countGuestSection % 2 == 0){
        topBlockGuests.style.marginTop = '0';
        topBlockGuests.style.display = 'block';
        countGuestSection++;
    }
    else {
        topBlockGuests.style.display = 'none';
        countGuestSection--;
    }
});

//Dropdown content for section choise checkbox with guests 
//calck of people
let plusRectangel = document.querySelectorAll('.dropdownSectionGuests__sectionWithDropdownContent--RectatanglePlus');
let rectanglP = document.querySelectorAll('.dropdownSectionGuests__sectionWithDropdownContent--Number');
let minusRectangel = document.querySelectorAll('.dropdownSectionGuests__sectionWithDropdownContent--RectatangleMinus');
let rectCount = [0, 0, 0];

plusRectangel.forEach (function(elem, index) {
    elem.addEventListener('click', () => {
        if (index == 0) {
            if (rectanglP[0].innerHTML < 20) {
                rectanglP[0].innerHTML = ++rectCount[0];
            } else {
                return;
            }
        }
        else if (index == 1) {
            if (rectanglP[1].innerHTML < 20) {
                rectanglP[1].innerHTML = ++rectCount[1]; 
            } else {
                return;
            }
        }
        else {
            if (rectanglP[2].innerHTML < 20) {
                rectanglP[2].innerHTML = ++rectCount[2];
            } else {
                return;
            }
        }
    });
    
});

minusRectangel.forEach (function(elem, index) {
    elem.addEventListener('click', () => {
        if (index == 0) {
            if (rectanglP[0].innerHTML > 0) {
                rectanglP[0].innerHTML = --rectCount[0];
            } else {
                return;
            }
            
        }
        else if (index == 1) {
            if (rectanglP[1].innerHTML > 0) {
                rectanglP[1].innerHTML = --rectCount[1];
            } else {
                return;
            } 
        }
        else {
            if (rectanglP[2].innerHTML > 0) {
                rectanglP[2].innerHTML = --rectCount[2];
            } else {
                return;
            } 
        }
    });
});



pagination
let buttonNextCount = 0;
const buttonNext = document.querySelector('.pagination__button');
let paginationItem = document.querySelectorAll('.pagination__list--item a');
buttonNext.addEventListener('click', () => {
    paginationItem[buttonNextCount].style.display = 'none';
    buttonNextCount++;
    paginationItem[buttonNextCount].style.color = "white";
    paginationItem[buttonNextCount].style.left = "215px";
    
});


//toogle section
const tooglfirst = document.querySelector('#choiseButton__toogle--first');
const toogleSecond = document.querySelector('#choiseButton__toogle--second');
const toogleSpan = document.querySelector('#choiseSpan__toogle');
const tooglediv = document.querySelector('.choiseButton__toogle');


toogleSecond.addEventListener('click', function() {
    if (toogleSecond.checked == true) {
        toogleSpan.style.left = '23px';
        tooglfirst.checked = false;
        tooglediv.style.border = '1px solid #BC9CFF';
        toogleSpan.style.background = 'linear-gradient(180deg, #BC9CFF 0%, #8BA4F9 100%)';
    };
});

tooglfirst.addEventListener('click', function() {
    if (tooglfirst.checked == true) {
        toogleSecond.checked = false;
        toogleSpan.style.left = '2px';
        tooglediv.style.border = '1px solid rgba(31, 32, 65, 0.25)';
        toogleSpan.style.background = 'rgba(31, 32, 65, 0.25)';
    };
});

//like section
const likediv = document.querySelector('.likeButton__choiseBox ');
const likeActive = document.querySelector('.like__active');
const likeUnActive = document.querySelector('.like__unactive');
const likeOut = document.querySelector('.likeButton__choiseBox--count');
const likeCheckBox = document.querySelector('.likeButton__choiseBox--choise');
let likeCheckBoxCount = 0;

likeCheckBox.addEventListener('click', function() {
    if (likeCheckBox.checked == true) {
        likeActive.style.opacity = '1';
        likediv.style.border = '1px solid #BC9CFF';
        likeUnActive.style.opacity = '0';
        likeOut.innerHTML = ++likeCheckBoxCount;
        likeOut.style.color = '#BC9CFF';
    }
});


//***********apartment section*******
let slyderContainer = document.querySelector('#listItems');
let rectangleImg = document.querySelectorAll('#rectangle');

let allListitems = document.querySelectorAll('#listitems');
console.log(allListitems);

const slyderDir = ['room', 'room1', 'room3'];
const urlImage = "url(./img/slider/"
const pngImage = ".png)";

slyderContainer.style.backgroundImage = urlImage + slyderDir[0] + pngImage;
document.querySelector('.next__img').addEventListener('click', nextclickButton);
document.querySelector('.prev__img').addEventListener('click', prevclickButton);
let countApart = 0;


function nextclickButton(){
  document.querySelector('.prev__img').disabled = false;
  countApart++;
  if (countApart < slyderDir.length) {
    document.querySelector('#listItems').style.backgroundImage = urlImage + slyderDir[countApart] + pngImage;
    rectangleImg[countApart].style.backgroundColor = 'white';
  }
  if (countApart == slyderDir.length) {
    document.querySelector('.next__img').disabled = true;
  }
}
console.log(count);

function prevclickButton(){
  document.querySelector('.next__img').disabled = false;

  countApart--
  if (countApart > 0) {
    document.querySelector('#listItems').style.backgroundImage = urlImage + slyderDir[countApart] + pngImage;
    rectangleImg[countApart].style.backgroundColor = '';
  }
  else if (countApart == 0) {
    document.querySelector('.prev__img').disabled = true;
  }
}








