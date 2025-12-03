document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES GERAIS ---
    const formCategoria = document.getElementById('form-categoria');
    const formMusica = document.getElementById('form-musica');
    const listaMusicasEl = document.getElementById('lista-musicas');
    
    const selectCategoriaMusica = document.getElementById('select-categoria-musica');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const buscaMusica = document.getElementById('busca-musica');

    // Variáveis para o Modal de Exclusão (Só existe na pag musicas)
    let modalDeleteInstance = null;
    let indexParaDeletar = null;
    const modalEl = document.getElementById('modal-confirm-delete');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    const txtMusicaDeletar = document.getElementById('musica-a-deletar');

    // Inicializa o Modal do Bootstrap se o elemento existir na pagina
    if (modalEl) {
        modalDeleteInstance = new bootstrap.Modal(modalEl);
    }

    // --- DADOS (LocalStorage ou Padrão) ---
    let musicas = JSON.parse(localStorage.getItem('musicas')) || [];
    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    // Dados Iniciais (Seed)
    if (categorias.length === 0) {
        categorias = [
            { nome: 'Rock', cor: '#2B124C' },
            { nome: 'Pop', cor: '#522B5B' },
            { nome: 'Hip-Hop', cor: '#854F6C' },
            { nome: 'Indie', cor: '#DFB6B2' },
            { nome: 'Jazz', cor: '#190019' }
        ];
        salvarCategorias();
    }

    if (musicas.length === 0) {
        musicas = [
            { titulo: 'Bohemian Rhapsody', artista: 'Queen', categoria: 'Rock' },
            { titulo: 'Shape of You', artista: 'Ed Sheeran', categoria: 'Pop' }
        ];
        salvarMusicas();
    }

    // --- FUNÇÕES DE ARMAZENAMENTO ---
    function salvarMusicas() { localStorage.setItem('musicas', JSON.stringify(musicas)); }
    function salvarCategorias() { localStorage.setItem('categorias', JSON.stringify(categorias)); }

    // --- RENDERIZAÇÃO ---
    function renderizarDropdowns() {
        if (selectCategoriaMusica) {
            selectCategoriaMusica.innerHTML = '<option value="" selected disabled>Selecione uma categoria...</option>';
            categorias.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.nome;
                opt.textContent = cat.nome;
                selectCategoriaMusica.appendChild(opt);
            });
        }
        if (filtroCategoria) {
            filtroCategoria.innerHTML = '<option value="todas">Todas as Categorias</option>';
            categorias.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.nome;
                opt.textContent = cat.nome;
                filtroCategoria.appendChild(opt);
            });
        }
    }

    function renderizarMusicas() {
        if (!listaMusicasEl) return; // Se não estiver na página de músicas, não faz nada

        listaMusicasEl.innerHTML = '';
        
        const filtro = filtroCategoria ? filtroCategoria.value : 'todas';
        const termo = buscaMusica ? buscaMusica.value.toLowerCase() : '';

        // Filtragem
        let lista = musicas.filter(m => {
            const matchCat = (filtro === 'todas') || (m.categoria === filtro);
            const matchTermo = m.titulo.toLowerCase().includes(termo) || 
                               (m.artista && m.artista.toLowerCase().includes(termo));
            return matchCat && matchTermo;
        });

        if (lista.length === 0) {
            listaMusicasEl.innerHTML = '<p class="text-center text-muted mt-4">Nenhuma música encontrada.</p>';
            return;
        }

        // Criação dos Elementos
        lista.forEach(musica => {
            const catObj = categorias.find(c => c.nome === musica.categoria);
            const cor = catObj ? catObj.cor : '#ccc';
            const realIndex = musicas.indexOf(musica);

            const item = document.createElement('div');
            item.className = 'musica-item card shadow-sm';
            item.style.borderLeft = `6px solid ${cor}`;

            item.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="card-title mb-1 fw-bold" style="color: var(--bg-dark);">${musica.titulo}</h5>
                        <h6 class="card-subtitle text-muted small">${musica.artista || "Desconhecido"}</h6>
                        <span class="badge mt-2" style="background-color: ${cor}; color: #fff;">
                            ${musica.categoria}
                        </span>
                    </div>
                    <button class="btn btn-outline-danger btn-delete">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            `;

            const btnDelete = item.querySelector('.btn-delete');
            btnDelete.onclick = () => abrirModalDelete(realIndex);

            listaMusicasEl.appendChild(item);
        });
    }

    // --- LÓGICA DE EXCLUSÃO (MODAL) ---
    function abrirModalDelete(index) {
        indexParaDeletar = index;
        const musica = musicas[index];
        if (txtMusicaDeletar) txtMusicaDeletar.textContent = `${musica.titulo} - ${musica.artista}`;
        if (modalDeleteInstance) modalDeleteInstance.show();
    }

    if (btnConfirmDelete) {
        btnConfirmDelete.onclick = () => {
            if (indexParaDeletar !== null) {
                musicas.splice(indexParaDeletar, 1);
                salvarMusicas();
                renderizarMusicas();
                if (modalDeleteInstance) modalDeleteInstance.hide();
            }
        };
    }

    // --- HANDLERS DE FORMULÁRIOS ---
    if (formCategoria) {
        formCategoria.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome-categoria').value.trim();
            const cor = document.getElementById('cor-categoria').value;
            if (nome) {
                categorias.push({ nome, cor });
                salvarCategorias();
                renderizarDropdowns();
                formCategoria.reset();
                alert('Categoria criada com sucesso!');
            }
        });
    }

    if (formMusica) {
        formMusica.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('titulo-musica').value.trim();
            const artista = document.getElementById('artista-musica').value.trim();
            const categoria = selectCategoriaMusica.value;
            
            if (titulo && categoria) {
                musicas.push({ titulo, artista, categoria });
                salvarMusicas();
                formMusica.reset();
                alert('Música adicionada com sucesso!');
                renderizarMusicas(); 
            }
        });
    }

    // --- LISTENERS DE FILTRO ---
    if (filtroCategoria) filtroCategoria.addEventListener('change', renderizarMusicas);
    if (buscaMusica) buscaMusica.addEventListener('input', renderizarMusicas);

    // --- INICIALIZAÇÃO ---
    renderizarDropdowns();
    renderizarMusicas();
});