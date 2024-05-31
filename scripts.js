const valueBusca = document.getElementById('text');

addEventListener("DOMContentLoaded", () => {
    clickSvg();
    callApi();
});

// FUNÇÕES

// CHAMAR AS INFOS
async function callData(){
    const req = await fetch(`https://servicodados.ibge.gov.br/api/v3/noticias?qtd=5`); //${window.location.search}
    const data = await req.json({});
    return data;
}

// TEM QUE RETORNAR COM A URL E OS PARAMS.
function setFilters(){

}

//ESTRUTURA DOS CARDS
async function callApi() {
    const ul = document.getElementById('ulCards')
    const filters = setFilters();
    //PASSAR OS "filters" como parametro do callData()
    const data = await callData();
    try {
        
        let cards = "";


        data.items.forEach(element => {
            
            const titulo = element.titulo;
            const introducao = element.introducao;
            const editorias = '#' + element.editorias;
            const link = element.link;
            const img = `https://agenciadenoticias.ibge.gov.br/` + JSON.parse(!!element.imagens ? element.imagens : '{"image":{"image_intro": ""}}').image_intro;
            const data_publicacao = converter(element.data_publicacao);

            cards += `
            <li class="liCards">
                <img src="${img}"    
                    alt="" class="imgClass">
                <div class="flexColumn">
                <div class="titleAndIntroAlignStart">
                    <h2>${titulo}</h2>
                    <p class="introducao">${introducao}</p>
                </div>
                    <div class="flex">
                        <p class="editorias">${editorias}</p>
                        <p class="data_publicacao">${data_publicacao}</p>
                    </div>
                    <button class="buttonRelease" onclick="callLink('${link}')">Leia mais</button>
                </div>
            </li>
            `

        });
        ul.innerHTML=cards;

    } catch (error) {
        console.log(error)
    }
}

function callLink(link){
    window.open(link, '_blank');
}

async function filtersApplication(event){
    event.preventDefault();
    const newURL = new URL(window.location);
    newURL.searchParams.set('busca', valueBusca.value);
    const data = await callData(valueBusca.value);
    // FAZER POR busca
}

function clickSvg() {
    const svg = document.querySelector('.svgClass');
    svg.addEventListener('click', () => {
        openDialog();
    });
}

function converter(data_publicacao){
    const [parteData, parteHora] = data_publicacao.split(' ');
    const [dia, mes, ano] = parteData.split('/').map(Number);
    const [horas, minutos, segundos] = parteHora.split(':').map(Number);
    const dataPub = new Date(ano, mes - 1, dia, horas, minutos, segundos);

    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    const dataPubApenas = new Date(dataPub);
    dataPubApenas.setHours(0, 0, 0, 0);

    const diferencaTempo = dataAtual.getTime() - dataPubApenas.getTime();
    const diferencaDias = Math.floor(diferencaTempo / (1000 * 60 * 60 * 24));

    if (diferencaDias === 0) {
        return 'Publicado Hoje';
    } else if (diferencaDias === 1) {
        return 'Publicado Ontem';
    } else {
        return `Publicado há ${diferencaDias} dias`;
    }
}

function openDialog() {
    const dialogWrapper = document.createElement('div');
    dialogWrapper.classList.add('dialog-wrapper');

    const dialog = document.createElement('dialog');
    dialog.classList.add('dialogClass');

    dialog.innerHTML = `
    <form id="edit-form">
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


