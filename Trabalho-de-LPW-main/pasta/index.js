document.addEventListener('DOMContentLoaded', () => {

    // seleciona elementos
    const formCategoria = document.getElementById('form-categoria');
    const formMusica = document.getElementById('form-musica');
    const listaMusicasEl = document.getElementById('lista-musicas');

    const selectCategoriaMusica = document.getElementById('select-categoria-musica');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const buscaMusica = document.getElementById('busca-musica');

    // aplicação
    let musicas = JSON.parse(localStorage.getItem('musicas')) || [];
    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    // dados 
    if (categorias.length === 0) {
        categorias = [
            { nome: 'Rock', cor: '#ff5733' },
            { nome: 'Pop', cor: '#33aaff' },
            { nome: 'Hip-Hop/Rap', cor: '#ff33aa' },
            { nome: 'R&B', cor: '#aaff33' },
            { nome: 'Soul', cor: '#ffaa33' },
            { nome: 'Funk americano', cor: '#aa33ff' },
            { nome: 'Jazz', cor: '#33ffaa' },
            { nome: 'Blues', cor: '#ff3333' },
            { nome: 'Música Clássica', cor: '#3333ff' },
            { nome: 'Música Eletrônica (EDM)', cor: '#ffff33' },
            { nome: 'House', cor: '#ff33ff' },
            { nome: 'Techno', cor: '#33ffff' },
            { nome: 'Trance', cor: '#aa3333' },
            { nome: 'Dubstep', cor: '#33aa33' },
            { nome: 'Drum and Bass', cor: '#aa33aa' },
            { nome: 'Reggae', cor: '#33aaaa' },
            { nome: 'Ska', cor: '#aaaa33' },
            { nome: 'Country', cor: '#3333aa' },
            { nome: 'Folk', cor: '#aa3333' },
            { nome: 'Metal', cor: '#33aa33' },
            { nome: 'Punk', cor: '#aaaa33' },
            { nome: 'Indie', cor: '#33aaaa' },
            { nome: 'MPB', cor: '#aa33aa' },
            { nome: 'Samba', cor: '#3333aa' },
            { nome: 'Bossa Nova', cor: '#aa3333' },
            { nome: 'Forró', cor: '#33aa33' },
            { nome: 'Funk Carioca', cor: '#aaaa33' },
            { nome: 'Sertanejo', cor: '#33aaaa' },
            { nome: 'Reggaeton', cor: '#aa33aa' },
            { nome: 'Salsa', cor: '#3333aa' },
            { nome: 'Cumbia', cor: '#aa3333' },
            { nome: 'K-pop', cor: '#33aa33' },
            { nome: 'J-pop', cor: '#aaaa33' },
            { nome: 'Gospel', cor: '#33aaaa' },
            { nome: 'New Age', cor: '#aa33aa' },
            { nome: 'Trilhas Sonoras (Soundtrack)', cor: '#3333aa' }
        ];
        salvarCategorias();
    }

    if (musicas.length === 0) {
        musicas = [
            { titulo: 'Bohemian Rhapsody', artista: 'Queen', categoria: 'Rock' },
            { titulo: 'Shape of You', artista: 'Ed Sheeran', categoria: 'Pop' },
            { titulo: 'Lose Yourself', artista: 'Eminem', categoria: 'Hip-Hop/Rap' },
            { titulo: 'Respect', artista: 'Aretha Franklin', categoria: 'Soul' },
            { titulo: 'Take Five', artista: 'Dave Brubeck', categoria: 'Jazz' },
            { titulo: 'Levels', artista: 'Avicii', categoria: 'Música Eletrônica (EDM)' },
            { titulo: 'Garota de Ipanema', artista: 'Tom Jobim', categoria: 'Bossa Nova' },
            { titulo: 'Ai Se Eu Te Pego', artista: 'Michel Teló', categoria: 'Sertanejo' },
            { titulo: 'Despacito', artista: 'Luis Fonsi ft. Daddy Yankee', categoria: 'Reggaeton' },
            { titulo: 'Gangnam Style', artista: 'Psy', categoria: 'K-pop' }
        ];
        salvarMusicas();
    }

    // funções de web storage
    function salvarMusicas() {
        localStorage.setItem('musicas', JSON.stringify(musicas));
    }

    function salvarCategorias() {
        localStorage.setItem('categorias', JSON.stringify(categorias));
    }

    // funções de renderização
    function renderizarDropdownsCategorias() {
        selectCategoriaMusica.innerHTML = '<option value="" selected disabled>Selecione uma categoria...</option>';
        filtroCategoria.innerHTML = '<option value="todas">Todas as Categorias</option>';

        categorias.forEach(cat => {
            const optionForm = document.createElement('option');
            optionForm.value = cat.nome;
            optionForm.textContent = cat.nome;
            selectCategoriaMusica.appendChild(optionForm);

            const optionFiltro = document.createElement('option');
            optionFiltro.value = cat.nome;
            optionFiltro.textContent = cat.nome;
            filtroCategoria.appendChild(optionFiltro);
        });
    }

    function renderizarMusicas(filtroCategoria = 'todas', termoBusca = '') {
        listaMusicasEl.innerHTML = '';

        let musicasFiltradas = (filtroCategoria === 'todas')
            ? musicas
            : musicas.filter(m => m.categoria === filtroCategoria);

        if (termoBusca.trim()) {
            musicasFiltradas = musicasFiltradas.filter(m =>
                m.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
                (m.artista && m.artista.toLowerCase().includes(termoBusca.toLowerCase()))
            );
        }

        if (musicasFiltradas.length === 0) {
            listaMusicasEl.innerHTML = '<p class="text-center text-muted">Nenhuma música encontrada.</p>';
            return;
        }

        musicasFiltradas.forEach(musica => {
            const categoriaObj = categorias.find(c => c.nome === musica.categoria);
            const cor = categoriaObj ? categoriaObj.cor : '#ccc';

            const musicaItem = document.createElement('div');
            musicaItem.className = 'musica-item card shadow-sm mb-3';
            // isso daqui ainda não funciona
            musicaItem.style.borderLeft = `5px solid ${cor}`;

            musicaItem.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1">${musica.titulo}</h5>
                        <h6 class="card-subtitle text-muted">${musica.artista || 'Artista desconhecido'}</h6>
                        <span class="badge" style="background-color: ${cor};">${musica.categoria}</span>
                    </div>
                    <button class="btn btn-sm btn-outline-danger btn-delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;

            const indiceReal = musicas.findIndex(m => m.titulo === musica.titulo && m.artista === musica.artista);
            musicaItem.querySelector('.btn-delete').addEventListener('click', () => {
                removerMusica(indiceReal);
            });

            listaMusicasEl.appendChild(musicaItem);
        });
    }

    function adicionarCategoria(nome, cor) {
        categorias.push({ nome, cor });
        salvarCategorias();
        renderizarDropdownsCategorias();
    }

    function adicionarMusica(titulo, artista, categoria) {
        musicas.push({ titulo, artista, categoria });
        salvarMusicas();
        renderizarMusicas(filtroCategoria.value, buscaMusica.value);
    }

    function removerMusica(index) {
        if (index > -1) {
            musicas.splice(index, 1);
            salvarMusicas();
            renderizarMusicas(filtroCategoria.value, buscaMusica.value);
        }
    }

    // eventos
    formCategoria.addEventListener('submit', e => {
        e.preventDefault();
        const nome = document.getElementById('nome-categoria').value.trim();
        const cor = document.getElementById('cor-categoria').value;
        if (!nome) return;
        adicionarCategoria(nome, cor);
        formCategoria.reset();
    });

    formMusica.addEventListener('submit', e => {
        e.preventDefault();
        const titulo = document.getElementById('titulo-musica').value.trim();
        const artista = document.getElementById('artista-musica').value.trim();
        const categoria = selectCategoriaMusica.value;
        if (!titulo || !categoria) return;
        adicionarMusica(titulo, artista, categoria);
        formMusica.reset();
    });

    filtroCategoria.addEventListener('change', () => {
        renderizarMusicas(filtroCategoria.value, buscaMusica.value);
    });

    buscaMusica.addEventListener('input', () => {
        renderizarMusicas(filtroCategoria.value, buscaMusica.value);
    });

    // inicializa as categorias e renderizacao
    renderizarDropdownsCategorias();
    renderizarMusicas();
});