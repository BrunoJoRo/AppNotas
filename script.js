document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const tituloInput = document.getElementById('tituloNota');
    const textoInput = document.getElementById('textoNota');
    const adicionarBtn = document.getElementById('adicionarBtn');
    const listaNotas = document.getElementById('listaNotas');
    const filtroBtns = document.querySelectorAll('.filtro-btn');
    
    // Variáveis de estado
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    let filtroAtual = 'todas';
    
    // Inicializar a aplicação
    function init() {
        renderizarNotas();
        adicionarEventListeners();
    }
    
    // Adicionar event listeners
    function adicionarEventListeners() {
        adicionarBtn.addEventListener('click', adicionarNota);
        
        textoInput.addEventListener('keypress', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                adicionarNota();
            }
        });
        
        filtroBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filtroBtns.forEach(b => b.classList.remove('ativo'));
                this.classList.add('ativo');
                filtroAtual = this.getAttribute('data-filtro');
                renderizarNotas();
            });
        });
    }
    
    // Adicionar uma nova nota
    function adicionarNota() {
        const titulo = tituloInput.value.trim();
        const texto = textoInput.value.trim();
        
        if (texto === '') {
            alert('Por favor, digite o conteúdo da nota!');
            textoInput.focus();
            return;
        }
        
        const novaNota = {
            id: Date.now(),
            titulo: titulo || 'Sem título',
            texto: texto,
            data: new Date().toLocaleString('pt-BR'),
            importante: false
        };
        
        notas.push(novaNota);
        salvarNotas();
        renderizarNotas();
        
        // Limpar os campos de entrada
        tituloInput.value = '';
        textoInput.value = '';
        tituloInput.focus();
    }
    
    // Renderizar a lista de notas
    function renderizarNotas() {
        listaNotas.innerHTML = '';
        
        let notasFiltradas = notas;
        if (filtroAtual === 'importantes') {
            notasFiltradas = notas.filter(nota => nota.importante);
        }
        
        if (notasFiltradas.length === 0) {
            listaNotas.innerHTML = '<p class="sem-notas">Nenhuma nota encontrada.</p>';
            return;
        }
        
        // Ordenar notas: importantes primeiro, depois pela data (mais recente primeiro)
        notasFiltradas.sort((a, b) => {
            if (a.importante && !b.importante) return -1;
            if (!a.importante && b.importante) return 1;
            return b.id - a.id;
        });
        
        notasFiltradas.forEach(nota => {
            const notaElement = document.createElement('div');
            notaElement.className = 'nota';
            if (nota.importante) {
                notaElement.classList.add('importante');
            }
            
            notaElement.innerHTML = `
                <h3 class="nota-titulo">${nota.titulo}</h3>
                <p class="nota-texto">${nota.texto}</p>
                <div class="nota-data">${nota.data}</div>
                <div class="nota-acoes">
                    <button class="nota-btn importante-btn ${nota.importante ? 'ativo' : ''}" 
                            data-id="${nota.id}">
                        ${nota.importante ? '★ Importante' : '☆ Marcar'}
                    </button>
                    <button class="nota-btn remover-btn" data-id="${nota.id}">Remover</button>
                </div>
            `;
            
            listaNotas.appendChild(notaElement);
        });
        
        // Adicionar event listeners aos botões das notas
        document.querySelectorAll('.importante-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                toggleImportante(parseInt(this.getAttribute('data-id')));
            });
        });
        
        document.querySelectorAll('.remover-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                removerNota(parseInt(this.getAttribute('data-id')));
            });
        });
    }
    
    // Alternar estado de importância da nota
    function toggleImportante(id) {
        notas = notas.map(nota => {
            if (nota.id === id) {
                return { ...nota, importante: !nota.importante };
            }
            return nota;
        });
        
        salvarNotas();
        renderizarNotas();
    }
    
    // Remover uma nota
    function removerNota(id) {
        if (confirm('Tem certeza que deseja remover esta nota?')) {
            notas = notas.filter(nota => nota.id !== id);
            salvarNotas();
            renderizarNotas();
        }
    }
    
    // Salvar notas no localStorage
    function salvarNotas() {
        localStorage.setItem('notas', JSON.stringify(notas));
    }
    
    // Inicializar o app
    init();
});