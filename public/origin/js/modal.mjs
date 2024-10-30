const $modal = document.querySelector(".header-container__modal");
const $modalSucess = document.querySelector(".main-container__ms");

const modal = () => {
    if($modal) {
        document.addEventListener("click", event => {
            const element = event.target;

            if(element.matches(".header-container__p--inline") && !$modal.classList.contains("is-visible")) {
                $modal.classList.add("is-visible");


            } else if (!(element.matches(".header-container__modal") || element.matches(".header-container__modal *")) && $modal.classList.contains("is-visible")) {
                $modal.classList.remove("is-visible");

            }

        });
    }

    if($modalSucess) {
        document.addEventListener("click", event => {
            const element = event.target;

            if(element.matches(".main-container__btn") && $modalSucess.classList.contains("is-visible")) {

                $modalSucess.classList.remove("is-visible");
            }
        });
    }

}


export default modal;