const dialog = document.getElementById('dialogClass');
const valueBusca = document.getElementById('text');
const tipo = document.getElementById('tipo');
const quantidade = document.getElementById('quantidade');
const de = document.getElementById('de');
const ate = document.getElementById('ate');

document.addEventListener("DOMContentLoaded", () => {
    clickSvg();
    setFilters();
    callApi();
});

// FUNÇÕES

// CHAMAR AS INFOS
async function callData() {
    const req = await fetch(`https://servicodados.ibge.gov.br/api/v3/noticias/${window.location.search}`);
    const data = await req.json();
    return data;
}

// TEM QUE RETORNAR COM A URL E OS PARAMS.
function setFilters() {
    const newUrl = new URL(window.location);
    valueBusca.value = newUrl.searchParams.get('busca') ?? '';
    tipo.value = newUrl.searchParams.get('tipo') ?? 'default';
    quantidade.value = newUrl.searchParams.get('qtd') ?? '10';
    de.value = newUrl.searchParams.get('de') ?? '';
    ate.value = newUrl.searchParams.get('ate') ?? '';
}

function updateURLParams() {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('qtd', quantidade.value);
    
    if(valueBusca.value !== ""){
        newUrl.searchParams.set('busca', valueBusca.value);
    } else{
        newUrl.searchParams.delete('busca');
    }

    if (tipo.value !== 'default') {
        newUrl.searchParams.set('tipo', tipo.value);
        document.getElementById('contador').textContent = cont++;
    } else {
        newUrl.searchParams.delete('tipo');
    }
    
    if (de.value !== '') {
        newUrl.searchParams.set('de', de.value);
        document.getElementById('contador').textContent = cont++;
    } else {
        newUrl.searchParams.delete('de');
    }
    
    if (ate.value !== '') {
        newUrl.searchParams.set('ate', ate.value);
        document.getElementById('contador').textContent = cont++;
    } else {
        newUrl.searchParams.delete('ate');
    }
    window.history.pushState({}, '', newUrl);
}

//ESTRUTURA DOS CARDS
async function callApi() {
    const ul = document.getElementById('ulCards')
    updateURLParams();
    const data = await callData();
    try {
        let cards = "";

        data.items.forEach(element => {
            const titulo = element.titulo;
            const introducao = element.introducao;
            const editorias = '#' + element.editorias;
            const link = element.link;
            const img = `https://agenciadenoticias.ibge.gov.br/` + JSON.parse(element.imagens || '{"image_intro": ""}').image_intro;
            const data_publicacao = converter(element.data_publicacao);

            cards += `
            <li class="liCards">
                <img src="${img}" alt="" class="imgClass">
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
        ul.innerHTML = cards;
    } catch (error) {
        console.error(error);
    }
}

function callLink(link) {
    window.open(link, '_blank');
}

async function filtersApplication(event) {
    event.preventDefault();
    updateURLParams();
    callApi();
}

function clickSvg() {
    const svg = document.querySelector('.svgClass');
    svg.addEventListener('click', () => {
        openDialog();
    });
}

function converter(data_publicacao) {
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
    tipo.value = "default";
    dialog.showModal();

    document.getElementById('cancel-dialog').textContent = "✖️";
    document.getElementById('cancel-dialog').addEventListener('click', function () {
        dialog.close();
    });
}

document.getElementById('edit-form').addEventListener('submit', (event) => {
    filtersApplication(event);
    dialog.close();
});
