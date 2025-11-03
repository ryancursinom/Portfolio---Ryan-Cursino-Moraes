function entrarEmContato(event) {
    event.preventDefault();

    const caminho = event.currentTarget.href;

    Swal.fire({
        title: "Tem certeza que deseja entrar em contato?",
        icon: "question",
        iconColor: "#C8995F",
        background: "white",
        showCancelButton: true,
        confirmButtonColor: "#C8995F",
        cancelButtonColor: "#fff",
        confirmButtonText: "Entrar em contato",
        cancelButtonText: "Cancelar",

        didOpen: (popup) => {
            const confirmButton = popup.querySelector('.swal2-confirm');
            const cancelButton = popup.querySelector('.swal2-cancel');

            popup.style.fontFamily = "Arial";
            popup.style.color = "#000";
            confirmButton.style.color = "white";
            cancelButton.style.color = "black";
            confirmButton.style.fontWeight = "bold";
            cancelButton.style.fontWeight = "bold";
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = caminho;
        }
    })
}