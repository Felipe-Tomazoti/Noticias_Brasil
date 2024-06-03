let array = [];
let x = 0;
const cont = document.getElementById('contador');
const dialog = document.getElementById('dialogClass');
const valueBusca = document.getElementById('text');
const tipo = document.getElementById('tipo');
const quantidade = document.getElementById('quantidade');
const de = document.getElementById('de');
const ate = document.getElementById('ate');

document.addEventListener("DOMContentLoaded", () => {
    createLiPagincao();
    clickSvg();
    setFilters();
    const currentPage = localStorage.getItem('currentPage') || 1;
    callApi(currentPage);
});

// FUNÇÕES

async function callData(page = 1) {
    const urlParams = new URLSearchParams(window.location.search);
    const qtd = urlParams.get('qtd') || 10;
    const busca = urlParams.get('busca') || '';
    const tipo = urlParams.get('tipo') || 'default';
    const de = urlParams.get('de') || '';
    const ate = urlParams.get('ate') || '';

    const req = await fetch(`https://servicodados.ibge.gov.br/api/v3/noticias/?page=${page}&qtd=${qtd}&busca=${busca}&tipo=${tipo}&de=${de}&ate=${ate}`);
    const data = await req.json();
    return data;
}

function setFilters() {
    const newUrl = new URL(window.location);
    valueBusca.value = newUrl.searchParams.get('busca') ?? '';
    tipo.value = newUrl.searchParams.get('tipo') ?? 'default';
    quantidade.value = newUrl.searchParams.get('qtd') ?? '10';
    de.value = newUrl.searchParams.get('de') ?? '';
    ate.value = newUrl.searchParams.get('ate') ?? '';
}

function updateURLParams() {
    let x = 1;
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('qtd', quantidade.value);
    
    if (valueBusca.value !== "") {
        newUrl.searchParams.set('busca', valueBusca.value);
    } else {
        newUrl.searchParams.delete('busca');
    }

    if (tipo.value !== '' && tipo.value !== 'default') {
        newUrl.searchParams.set('tipo', tipo.value);
        x++;
    } else {
        newUrl.searchParams.delete('tipo');
    }

    if (de.value !== '') {
        newUrl.searchParams.set('de', de.value);
        x++;
    } else {
        newUrl.searchParams.delete('de');
    }

    if (ate.value !== '') {
        newUrl.searchParams.set('ate', ate.value);
        x++;
    } else {
        newUrl.searchParams.delete('ate');
    }
    cont.textContent = x;
    window.history.pushState({}, '', newUrl);
}

async function callApi(page = 1) {
    const ul = document.getElementById('ulCards');
    updateURLParams();
    localStorage.setItem('currentPage', page);
    const data = await callData(page);
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
            `;
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
    callApi(1);
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
    setFilters();
    dialog.showModal();

    document.getElementById('cancel-dialog').textContent = "✖️";
    document.getElementById('cancel-dialog').addEventListener('click', function () {
        dialog.close();
    });
}

function updatePag(event, page) {
    event.preventDefault();
    createLiPagincao(page);
    callApi(page);
}

function createLiPagincao(currentPage = 1) {
    const ul = document.getElementById('paginacao');
    ul.innerHTML = '';

    let startPage = Math.max(1, currentPage - 5);
    let endPage = startPage + 9;

    for (let contador = startPage; contador <= endPage; contador++) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.classList.add('buttonClassPag');
        button.textContent = contador;
        array.push(button.textContent);
        button.addEventListener('click', (event) => {
            updatePag(event, contador);
        });
        li.appendChild(button);
        ul.appendChild(li);
    }
}

document.getElementById('edit-form').addEventListener('submit', (event) => {
    filtersApplication(event);
    dialog.close();
});
