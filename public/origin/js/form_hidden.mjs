const $form = document.querySelector(".main-container__form");
const $hiddenInput = document.querySelectorAll(".main-container__hidden");

const hidden = () => {
    if($form) {
        document.addEventListener("click", event => {
            const element = event.target;
            
            if(element.matches(".main-container__submit")){  
                const $radioButton = document.querySelectorAll(".main-container__radio:checked");
                
                for(let i = 0; i < $radioButton.length; i++) {

                    $hiddenInput[i].value = $radioButton[i].getAttribute("data-value");
                    console.log($radioButton[i].getAttribute("data-value"));
                }
            
            }

        });
    }
}

export default hidden;