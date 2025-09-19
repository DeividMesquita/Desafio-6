$.ajax({
    url: 'https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=CE&ordem=ASC&ordenarPor=nome',
    method: 'GET',
    dataType: 'json',
    crossDomain: true, // força requisição cross-domain
    success: function(data) {
        console.log("Dados recebidos:", data); // verifica se chegou algo
        const deputadosListagem = $('.c-deputados__listagem');

        data.dados.forEach(function(deputado) {
            // Criação dos elementos para cada deputado
            const deputadoItem = $('<div>').addClass('c-deputados__item');

            const deputadoFoto = $('<img>').attr({
                src: deputado.urlFoto,
                alt: `Foto de ${deputado.nome}`
            });

            const deputadoNome = $('<h3>').text(deputado.nome);
            const deputadoPartido = $('<p>').text(`${deputado.siglaPartido} - ${deputado.siglaUf}`);

            // Armazena o ID do deputado no elemento
            deputadoItem.data('deputadoId', deputado.id);

            // Adiciona os elementos criados ao item do deputado
            deputadoItem.append(deputadoFoto, deputadoNome, deputadoPartido);

            // Adiciona o item à listagem de deputados
            deputadosListagem.append(deputadoItem);

            // Evento de clique para abrir o modal
            deputadoItem.on('click', function() {
                const deputadoId = $(this).data('deputadoId');

                $.ajax({
                    url: `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputadoId}`,
                    method: 'GET',
                    dataType: 'json',
                    crossDomain: true,
                    success: function(deputadoDetalhe) {
                        const depData = deputadoDetalhe.dados;

                        $('#modalFoto').attr('src', depData.ultimoStatus.urlFoto);
                        $('#modalNome').text(depData.ultimoStatus.nome);
                        $('#modalPartido').text(depData.ultimoStatus.siglaPartido);
                        $('#modalFrentes').text('Informação não disponível');
                        $('#modalUf').text(depData.ultimoStatus.siglaUf);
                        $('#modalNaturalidade').text(depData.municipioNascimento || 'Não disponível');
                        $('#modalNascimento').text(depData.dataNascimento || 'Não disponível');
                        $('#modalCpf').text(depData.cpf || 'Não disponível');
                        $('#modalEmail').text(depData.ultimoStatus.gabinete.email || 'Não disponível');
                        $('#modalSexo').text(depData.sexo === 'M' ? 'Masculino' : 'Feminino');
                        $('#modalEscolaridade').text(depData.escolaridade || 'Não disponível');
                        $('#modalNomeCivil').text(depData.nomeCivil || depData.ultimoStatus.nome);

                        $('#deputadoModal').fadeIn();
                    },
                    error: function(xhr, status, error) {
                        console.error('Erro ao buscar detalhes do deputado:', status, error, xhr);
                    }
                });
            });
        });

        // Evento para fechar o modal
        $('.l-modal__fechar').on('click', function() {
            $('#deputadoModal').fadeOut();
        });
    },
    error: function(xhr, status, error) {
        console.error('Erro ao buscar os dados:', status, error, xhr);
    }
});

// Compartilhamento nas redes sociais
document.addEventListener('DOMContentLoaded', function () {
    const url = encodeURIComponent(location.href);
    const text = encodeURIComponent('Confira o Monitor de Bancada dos Deputados Federais do Ceará! Uma ferramenta que facilita o acesso às informações e atuações dos representantes do nosso estado no Congresso. Acompanhe, avalie e fique por dentro das atividades dos parlamentares. #Transparência #Política #Ceará');

    const socialLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        whatsapp: `https://api.whatsapp.com/send?text=${text}%20${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        telegram: `https://t.me/share/url?url=${url}&text=${text}`
    };

    const icons = document.querySelectorAll('.l-banner__sociais a');

    icons.forEach(icon => {
        const imgAlt = icon.querySelector('img').alt.toLowerCase();
        if (socialLinks[imgAlt]) {
            icon.href = socialLinks[imgAlt];
            icon.target = '_blank';
            icon.rel = 'noopener noreferrer';
        }
    });
});
