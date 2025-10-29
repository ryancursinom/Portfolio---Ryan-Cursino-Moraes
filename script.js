function confirmarContato(event) {
   event.preventDefault();

   const link = event.target.getAttribute("href");

    Swal.fire({
        title: "Deseja entrar em contato?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "blue",
        cancelButtonColor: "red",
        confirmButtonText: "Enviar e-mail",
        cancelButtonText: "Cancelar",

        didOpen: (popup) => {
            const confirmButton = popup.querySelector('.swal2-confirm');
            const cancelButton = popup.querySelector('.swal2-cancel');

            popup.style.fontFamily = "Arial";
            popup.style.backgroundColor = "black";
            popup.style.color = "white";
            popup.style.borderRadius = "10px";

            confirmButton.style.fontSize = "1.3rem";
            cancelButton.style.fontSize = "1.3rem";
            
        }
    }).then((result) => {
        if (result.isConfirmed){
            window.location.href = link;
        }
    })

    return false;
}