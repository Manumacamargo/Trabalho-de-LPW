/* ARQUIVO: pasta_musicas/script.js */

document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES GERAIS ---
    const formCategoria = document.getElementById('form-categoria');
    const formMusica = document.getElementById('form-musica');
    const listaMusicasEl = document.getElementById('lista-musicas');
    const listaCategoriasUl = document.getElementById('lista-categorias-ul');
    
    const selectCategoriaMusica = document.getElementById('select-categoria-musica');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const buscaMusica = document.getElementById('busca-musica');

    // Variáveis para Modal de Exclusão (Músicas)
    let modalDeleteInstance = null;
    let indexParaDeletar = null;
    const modalEl = document.getElementById('modal-confirm-delete');
    const btnConfirmDelete = document.getElementById('btn-confirm-delete');
    const txtMusicaDeletar = document.getElementById('musica-a-deletar');

    if (modalEl) modalDeleteInstance = new bootstrap.Modal(modalEl);

    // --- DADOS ---
    let musicas = JSON.parse(localStorage.getItem('musicas')) || [];
    let categorias = JSON.parse(localStorage.getItem('categorias')) || [];

    if (!Array.isArray(categorias)) categorias = [];

    // --- DADOS INICIAIS (Se estiver vazio) ---
    if (categorias.length === 0) {
        categorias = [
            { nome: 'Rock', cor: '#2B124C' },
            { nome: 'Pop', cor: '#522B5B' },
            { nome: 'Hip-Hop', cor: '#854F6C' },
            { nome: 'Indie', cor: '#DFB6B2' },
            { nome: 'Jazz', cor: '#190019' },
            { nome: 'MPB', cor: '#2E8B57' },
            { nome: 'Eletrônica', cor: '#00CED1' },
            { nome: 'Samba', cor: '#FFD700' }
        ];
        salvarCategorias();
    }

    if (musicas.length === 0) {
        musicas = [
            { titulo: 'Bohemian Rhapsody', artista: 'Queen', categoria: 'Rock' },
            { titulo: 'Shape of You', artista: 'Ed Sheeran', categoria: 'Pop' },
            { titulo: 'Lose Yourself', artista: 'Eminem', categoria: 'Hip-Hop' },
            { titulo: 'Do I Wanna Know?', artista: 'Arctic Monkeys', categoria: 'Indie' },
            { titulo: 'Fly Me To The Moon', artista: 'Frank Sinatra', categoria: 'Jazz' },
            { titulo: 'Águas de Março', artista: 'Elis Regina', categoria: 'MPB' },
            { titulo: 'Wake Me Up', artista: 'Avicii', categoria: 'Eletrônica' },
            { titulo: 'Trem das Onze', artista: 'Adoniran Barbosa', categoria: 'Samba' }
        ];
        salvarMusicas();
    }

    // --- FUNÇÕES DE ARMAZENAMENTO ---
    function salvarMusicas() { localStorage.setItem('musicas', JSON.stringify(musicas)); }
    function salvarCategorias() { localStorage.setItem('categorias', JSON.stringify(categorias)); }

    // --- TOASTS (Notificações) ---
    function mostrarToast(mensagem, tipo = 'success') {
        const toastEl = document.getElementById('liveToast');
        const toastBody = document.getElementById('toast-body-text');
        
        if (toastEl && toastBody) {
            // Vermelho para erro, Verde para sucesso
            toastEl.style.borderLeft = tipo === 'success' ? "5px solid #4CAF50" : "5px solid #F44336";
            toastBody.textContent = mensagem;
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        } else {
            console.log(mensagem); 
        }
    }

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

    function renderizarListaCategorias() {
        if (!listaCategoriasUl) return; 

        listaCategoriasUl.innerHTML = '';
        
        categorias.forEach((cat, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <span style="display:inline-block; width: 20px; height: 20px; background-color: ${cat.cor}; border-radius: 50%; margin-right: 10px; border: 1px solid #ddd;"></span>
                    <span class="fw-bold">${cat.nome}</span>
                </div>
                <button class="btn btn-sm btn-outline-danger btn-delete-cat" title="Remover Categoria">
                    <i class="bi bi-trash"></i>
                </button>
            `;

            const btnDelete = li.querySelector('.btn-delete-cat');
            btnDelete.addEventListener('click', () => {
                removerCategoria(index);
            });

            listaCategoriasUl.appendChild(li);
        });
    }

    function renderizarMusicas() {
        if (!listaMusicasEl) return;

        listaMusicasEl.innerHTML = '';
        const filtro = filtroCategoria ? filtroCategoria.value : 'todas';
        const termo = buscaMusica ? buscaMusica.value.toLowerCase() : '';

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

    // --- FUNÇÃO DE REMOVER CATEGORIA (ALTERADA) ---
    function removerCategoria(index) {
        const categoriaNome = categorias[index].nome;
        
        // Verifica se existem músicas usando essa categoria
        const musicaUsando = musicas.some(m => m.categoria === categoriaNome);
        
        if (musicaUsando) {
            // AQUI ESTÁ A MUDANÇA: Usamos o Toast em vez do Alert
            mostrarToast(`Erro: A categoria "${categoriaNome}" possui músicas! Apague-as antes.`, "error");
            return;
        }

        // Mantemos o confirm nativo pois ele é uma segurança padrão do navegador
        // Se quiser remover isso também, me avise!
        if (confirm(`Tem certeza que deseja apagar a categoria "${categoriaNome}"?`)) {
            categorias.splice(index, 1);
            salvarCategorias();
            
            renderizarListaCategorias();
            renderizarDropdowns();
            mostrarToast("Categoria removida com sucesso!", "success");
        }
    }

    // --- MODAL DELETE (Músicas) ---
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
                mostrarToast("Música removida!");
            }
        };
    }

    // --- EVENT LISTENERS ---
    if (formCategoria) {
        formCategoria.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome-categoria').value.trim();
            const cor = document.getElementById('cor-categoria').value;
            
            const existe = categorias.some(c => c.nome.toLowerCase() === nome.toLowerCase());
            
            if (existe) {
                mostrarToast("Essa categoria já existe!", "error");
                return;
            }

            if (nome) {
                categorias.push({ nome, cor });
                salvarCategorias();
                renderizarDropdowns();
                renderizarListaCategorias();
                formCategoria.reset();
                mostrarToast(`Categoria "${nome}" criada!`);
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
                mostrarToast(`Música adicionada!`);
                renderizarMusicas(); 
            } else {
                mostrarToast("Selecione uma categoria!", "error");
            }
        });
    }

    if (filtroCategoria) filtroCategoria.addEventListener('change', renderizarMusicas);
    if (buscaMusica) buscaMusica.addEventListener('input', renderizarMusicas);

    renderizarDropdowns();
    renderizarMusicas();
    renderizarListaCategorias();
});
