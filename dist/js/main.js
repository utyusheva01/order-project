const DISH_PRICE = 220;
const SAUCE_PRICE = 60;


const orderModal = document.querySelector('#order-modal');

const inputsList = orderModal.querySelectorAll('.modal_quantity');
const sauceList = orderModal.querySelectorAll('.product-card_sauce-item');

const btnAdd = orderModal.querySelector('.product-card_add-button');

const totalPrice = orderModal.querySelector('#price-value');
totalPrice.textContent = DISH_PRICE;

let sauceOrderArray = [];
initSauceListArray();

sauceList.forEach((item) => {
    const btnMinus = item.querySelector(".modal_control-decrement");
    const btnPlus = item.querySelector(".modal_control-increment");
    const inputQuantity = item.querySelector(".modal_quantity");

    btnPlus.addEventListener("click", () => {
        let value = Number(inputQuantity.value);
        if (value < 10) {
            inputQuantity.value = value + 1;
            inputQuantity.dispatchEvent(new Event("input"));
        }
        if (value >= 9) {
            btnPlus.classList.add('disabled');
        }
        btnMinus.classList.remove('disabled');
    });

    btnMinus.addEventListener("click", () => {
        let value = Number(inputQuantity.value);
        if (value > 0) {
            inputQuantity.value = value - 1;
            inputQuantity.dispatchEvent(new Event("input"));
        }
        if (value <= 1) {
            btnMinus.classList.add('disabled');
        }
        btnPlus.classList.remove('disabled');
    });


    inputQuantity.addEventListener("input", (event) => {
        updateHtml(sauceOrderArray)
        // Все данные о заказе соусов мы храним в sauceOrderArray.
        const itemName = event.target.dataset.name;
        const newValue = Number(event.target.value);

        const item = sauceOrderArray.find(i => i.name === itemName);
        const oldValue = item.value;


        sauceOrderArray = sauceOrderArray.map(item => {
            if (item.name === itemName) {
                let newItem = {
                    ...item
                };

                const isPlus = oldValue < newValue;
                const isMinus = oldValue > newValue;
                const hasFree = sauceOrderArray.some(s => s.hasFree);/// есть ли хотя бы один элемент в массиве sauceOrderArray, у которого значение свойства hasFree равно true.


                // операции с +
                //  проверяем что бесплатного соуса пока нет (hasFree = false),
                // и что предыдущее значение соуса было нулевым (oldValue === 0)
                if (isPlus && !hasFree && oldValue === 0) {
                    newItem.hasFree = true;
                    newItem.value = newValue;
                    newItem.price = 0;

                }

                // существует ли уже хотя бы один элемент в массиве соусов, который является бесплатным (hasFree).
                if (isPlus && hasFree) {
                    newItem.value = newValue;
                    newItem.price = SAUCE_PRICE * (newValue - 1);
                }


                ///проверяет  есть ли в массиве хотя бы один элемент с бесплатным соусом (hasFree === true)
                //  и у текущего элемента newItem отсутствует свойство hasFree (!newItem.hasFree === true).
                if (isPlus && hasFree && !newItem.hasFree) {
                    newItem.value = newValue;
                    newItem.price = SAUCE_PRICE * newValue;

                }

                // операции с -

                // у текущего элемента (newItem) есть свойство hasFree со значением true, и новое значение (newValue) равно 0.
                if (isMinus && newItem?.hasFree === true && newValue === 0) {
                    newItem.value = newValue;
                    newItem.hasFree = false;
                    newItem.price = 0;

                    const itemsWithValue = sauceOrderArray.filter(item => item.value && item.name !== newItem.name);

                    if (itemsWithValue.length) {
                        const firstItemWithValue = itemsWithValue[0];
                        firstItemWithValue.hasFree = true;
                        firstItemWithValue.price = SAUCE_PRICE * (firstItemWithValue.value - 1);
                    }
                }

                // у текущего элемента нет свойства hasFree или его значение равно false.
                if (isMinus && !newItem?.hasFree) {
                    newItem.value = newValue;
                    newItem.price = SAUCE_PRICE * newValue;
                }

                return newItem;
            }

            return item;

        });
        updateHtml(sauceOrderArray);

    });

});


function updateHtml(sauceOrderArray) {
    const priceSauces = document.querySelectorAll('.product-card_sauce-item_price');
    const amount = orderModal.querySelector('.product-card_sauces-amount');
    const hasFreeSauce = sauceOrderArray.some(item => item.hasFree);
    let total = 0;

    // Перебираем все элементы массива sauceOrderArray и присваиваем соответствующее значение текстовому содержимому каждому элементу priceSauces
    sauceOrderArray.forEach((item, index) => {
        priceSauces[index].textContent = "+" + item.price + " ₽";

        if (hasFreeSauce) {
            amount.textContent = "1 / 1 за 0₽";
        } else {
            amount.textContent = "0 / 1 за 0₽";
        }

        if (item.value > 10) {
            btnPlus.classList.add('disabled');
        }

        total = total + item.price
    })

    totalPrice.textContent = total + DISH_PRICE;
}

btnAdd.addEventListener("click", (e) => {
    console.log("Выбранные соусы", sauceOrderArray)
})


function initSauceListArray() {
    inputsList.forEach(input => {
        const value = parseInt(input.value);
        const itemTextContent = input.closest('.product-card_sauce-item').textContent.trim();
        const spanText = input.closest('.product-card_sauce-item').querySelector('.product-card_sauce-item_price').textContent.trim();
        const name = itemTextContent.replace(spanText, '').trim();

        const item = {
            name,
            value,
            price: 0,
            hasFree: false,
        }

        sauceOrderArray.push(item);
    });
}




