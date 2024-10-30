const $formLogin = document.querySelector(".main-container__login");
const $formRegister = document.querySelector(".main-container__register");

const formValidations = () => {
    if($formLogin || $formRegister) {//Si existen los elementos en el documento se ejecuta la siguiente documentación.
        document.addEventListener("keyup", event => {//Se agrega el evento "keyup" al documento completo.
            const element = event.target;//Se asigna el elemento que origina el evento a una constante.
            if(element.matches(".main-container__input")) {//Si el elemento que origna el evento es igual al siguiente selector de clase CSS se ejecuta la siguiente programación.
                console.log(element);
                console.log(element.getAttribute("pattern"));

                const exreg = new RegExp(element.getAttribute("pattern"));

                console.l
                /*El método "exec" valida si la expresion regular se cumple, si no se cumple retorna un null,
                 si no se cumple retorna un null y además el valor del elemento que origina el evento debe ser diferente a vacío.*/

                if((exreg.exec(element.value) === null) && (element.value !== "")) {
                    console.log("te puedo asegurar que esta pasando algo");
                    document.getElementById(element.getAttribute("name")).classList.add("is-active");
                }else {
                    document.getElementById(element.getAttribute("name")).classList.remove("is-active");
                }
            }
        });
    }

}

export default formValidations;
