window.addEventListener('DOMContentLoaded', function(){

'use strict';

// ТАБИ
let infoHeader = this.document.querySelector('.info-header'),
    infoHeaderTab = this.document.querySelectorAll('.info-header-tab'),
    infoTabContent = this.document.querySelectorAll('.info-tabcontent');

    // Функція для приховання всіх елементів
    function hideTabContent(a){
        for (let i = a; i < infoTabContent.length; i++){
            infoTabContent[i].classList.remove('show');
            infoTabContent[i].classList.add('hide');
        }
    }

    // Перший елемент відображаємо по дефолту
    hideTabContent(1);

    // Функція, яка відображає елемент за вказаним індексом
    function showTabContent(b){
        if (infoTabContent[b].classList.contains('hide')) {
            infoTabContent[b].classList.remove('hide');
            infoTabContent[b].classList.add('show');
        }
    }

    // Відображення табу за нажаттям на певний заголовок 
    infoHeader.addEventListener('click', function(event){
        let target = event.target;

        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < infoHeaderTab.length; i++) {
                if (target == infoHeaderTab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
                
            }
        }
    });



    // ТАЙМЕР
    let deadline = '2022-12-31';    

    // Отримуємо години, хвилини та секунди
    function getTimeRemaining(endtime){
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60) % 60),
            hours = Math.floor((t/ (1000 * 60 * 60)));

            return{
                'total': t,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
    }

    function setClock(id, endtime){

        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

    
            // Функція, що оновлюватиме таймер кожну секунду
            function updateClock(){
                let t = getTimeRemaining(endtime);
               
                // Відображення цифр на таймері  
                t.seconds < 10 ? seconds.textContent = '0' + t.seconds : seconds.textContent = t.seconds; 
                t.minutes < 10 ? minutes.textContent = '0' + t.minutes : minutes.textContent = t.minutes; 
                t.hours < 10 ? hours.textContent = '0' + t.hours : hours.textContent = t.hours; 


                if (t.total < 0) {
                    clearInterval(timeInterval);
                    hours.textContent = minutes.textContent = seconds.textContent = '00';
                }
            }
    }


    setClock('timer', deadline);




    // МОДАЛЬНЕ ВІКНО
    let more = this.document.querySelector('.more'),
        overlay = this.document.querySelector('.overlay'),
        close = this.document.querySelector('.popup-close'),
        descriptionButtons = this.document.querySelectorAll('.description-btn');

    function showModalWindow(modal){

        modal.addEventListener('click', function(){
            overlay.style.display = 'block';
            modal.classList.add('more-splash');
            document.body.style.overflow = 'hidden';
        })
    }


    showModalWindow(more);

    descriptionButtons.forEach(element => {
        showModalWindow(element)
    });  

     close.addEventListener('click', function(){
        overlay.style.display = '';
        more.classList.remove('more-splash');
        document.body.style.overflow = '';
     })

});

// КЛАС ДЛЯ СТВОРЕННЯ НОВИХ DIV-ів

class Options {

    constructor(height, width, bg, fontSize, textAlign){
        this.height = height;
        this.width = width;
        this.bg = bg;
        this.fontSize = fontSize;
        this.textAlign = textAlign;
    }

    content = document.querySelector('.content');
    
    createNewDiv(t){
       let newElem = document.createElement('div');
       this.content.appendChild(newElem);
       newElem.innerText = t;

        newElem.style.cssText = `height: ${this.height + 'px'};
        background-color: ${this.bg};
        width: ${this.width + 'px'};
        font-size: ${this.fontSize + 'px'};
        text-align: ${this.textAlign};`

    }
    
}

// ЗАПИТ НА ВІДПРАВЛЕННЯ НА СЕРВЕР

const url = 'https://jsonplaceholder.typicode.com/posts';

// Повідомлення при надсиланні запиту
let message = {
    load: 'Зачекайте, триває загрузка',
    succes: 'Ваші дані відправлені, ми скоро з вами зв`яжемося',
    failure: 'Уупс, щось пішло не так'
}

// Отримуємо форму та вивід
let form = document.querySelector('.main-form'),
    input = document.querySelector('input'),
    statusMessage = document.createElement('div');

    statusMessage.classList.add('status');


// Функція для надсилання запиту
function sendRequest(){
    return new Promise( (resolve, reject) => {
        form.appendChild(statusMessage);

        // Надсилаємо запит
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        
        let formData = new FormData(form);
        xhr.send(formData);

        xhr.onreadystatechange = function(){
            if(xhr.readyState < 4){
                resolve();
            }else if (xhr.readyState === 4){
                if(xhr.status == 200){
                    resolve();
                }
            } else { reject()}
        }
    })
}


// Вішаємо на форму обробник подій
    form.addEventListener('submit', (event) => {
       event.preventDefault();
       sendRequest()
       .then(() => statusMessage.textContent = message.load)
       .then(() => statusMessage.textContent = message.succes)
       .catch(() => statusMessage.textContent = message.failure);
    })



// СЛАЙДЕР

let sliderItem = 1,
    slider = document.querySelectorAll('.slider-item'),
    prev = document.querySelector('.prev'),
    next = document.querySelector('.next'),
    sliderDots = document.querySelector('.slider-dots'),
    dot = sliderDots.querySelectorAll('.dot');

    // Функція, що показує слайди 
    function showSlide(index){

        if(index > slider.length ){
            sliderItem = 1;
        }

        if(index < 1 ){
            sliderItem = slider.length;
        }


        slider.forEach((element) => {
            element.style.display = 'none';
        });

        dot.forEach(element => {
            element.classList.remove('dot-active');
        });

        slider[sliderItem - 1].style.display = 'block';
        dot[sliderItem - 1].classList.add('dot-active');
    }

    showSlide(sliderItem);

    // Функція для додавання/віднімання слайдів
    function PlusSlider(n){
        showSlide(sliderItem += n);
    }

    // Функція для відображення слайду по кліку
    function CurentSlider(n){
         showSlide(sliderItem = n);
    }



    next.addEventListener('click', () => {
        PlusSlider(1);
    })

    prev.addEventListener('click', () => {
        PlusSlider(-1);
    })

    sliderDots.addEventListener( 'click', (event) => {
        for(let i = 0; i < dot.length + 1; i++){
            if(event.target.classList.contains('dot') && event.target == dot[i - 1]){
                CurentSlider(i);
            }
        }
    })


// КАЛЬКУЛЯТОР

let peopleCounter = document.querySelectorAll('.counter-block-input')[0],
    dayCounter = document.querySelectorAll('.counter-block-input')[1],
    select = document.querySelector('#select'),
    totalValue = document.querySelector('#total'),
    peopleSum = 0,
    daySum = 0,
    total = 0;

    totalValue.innerHTML = 0;

    peopleCounter.addEventListener('change', () => {
        peopleSum = +peopleCounter.value;
        total = (daySum + peopleSum) * 4000;
        
        
        if(dayCounter.value == ''){
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }

        if(peopleCounter.value == ''){
            totalValue.innerHTML = 0;
        }
    })

    dayCounter.addEventListener('change', () => {
        daySum = +dayCounter.value;
        total = (daySum + peopleSum) * 4000;
     
        if(peopleCounter.value == ''){
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
        }

        if(dayCounter.value == ''){
            totalValue.innerHTML = 0;
        }

        
    })


    select.addEventListener('change', function(){
        
        if(peopleCounter.value == '' || dayCounter.value == ''){
            totalValue.innerHTML = 0;
        } else {
            let a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }

    })







