function clickSvg() {
    const svg = document.querySelector('.svgClass');
    svg.addEventListener('click', () => {
        openDialog();
    });
}

function openDialog() {
    const dialogWrapper = document.createElement('div');
    dialogWrapper.classList.add('dialog-wrapper');

    const dialog = document.createElement('dialog');
    dialog.classList.add('dialogClass');

    dialog.innerHTML = `
    <form class="edit-form">
        <div class="divParent">
            <div class="divParent1">
                <div class="form-row">
                    <label>Tipo:</label>
                    <select>
                        <option value="default">Selecione</option>
                        <option value="noticia">Notícia</option>
                        <option value="release">Release</option>
                    </select>
                </div>
                <div class="form-row">
                    <label>Quantidade:</label>
                    <select>
                        <option value="5">5</option>
                        <option value="10" selected>10</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>
            <div class="divParent2">
                <div class="form-row">
                    <label>De:</label>
                    <input class="date" type="date" />
                </div>
                <div class="form-row">
                    <label>Até:</label>
                    <input class="date" type="date" />
                </div>
            </div>
        </div>
        <div class="buttonClass">
            <button type="submit" id="edit-dialog">Aplicar</button>
            <button type="button" id="cancel-dialog">Cancelar</button>
        </div>
    </form>
    `;

    dialogWrapper.appendChild(dialog);
    document.body.appendChild(dialogWrapper);

    dialog.showModal();

    document.getElementById('cancel-dialog').textContent = "✖️";
    document.getElementById('cancel-dialog').addEventListener('click', function () {
        dialog.close();
        dialogWrapper.remove();
    });
}

addEventListener("DOMContentLoaded", () => {
    clickSvg();
});
