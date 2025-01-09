$.ajax({
    url: 'https://dadosabertos.camara.leg.br/api/v2/deputados?siglaUf=CE&ordem=ASC&ordenarPor=nome',
    method: 'GET',
    dataType: 'json',
    success: function(data) {
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

            // Armazenar o ID do deputado no elemento
            deputadoItem.data('deputadoId', deputado.id);

            // Adiciona os elementos criados ao item do deputado
            deputadoItem.append(deputadoFoto, deputadoNome, deputadoPartido);

            // Adiciona o item à listagem de deputados
            deputadosListagem.append(deputadoItem);

            // Adiciona evento de clique para abrir o modal
            deputadoItem.on('click', function() {
                const deputadoId = $(this).data('deputadoId');

                // Fazendo uma nova requisição para obter detalhes do deputado pelo ID
                $.ajax({
                    url: `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputadoId}`,
                    method: 'GET',
                    dataType: 'json',
                    success: function(deputadoDetalhe) {
                        const depData = deputadoDetalhe.dados;

                        // Preencher o modal com as informações detalhadas do deputado
                        $('#modalFoto').attr('src', depData.ultimoStatus.urlFoto);
                        $('#modalNome').text(depData.ultimoStatus.nome);
                        $('#modalPartido').text(depData.ultimoStatus.siglaPartido);
                        $('#modalFrentes').text('Informação não disponível'); // Pode ser preenchido conforme necessidade
                        $('#modalUf').text(depData.ultimoStatus.siglaUf);
                        $('#modalNaturalidade').text(depData.municipioNascimento || 'Não disponível');
                        $('#modalNascimento').text(depData.dataNascimento || 'Não disponível');
                        $('#modalCpf').text(depData.cpf || 'Não disponível');
                        $('#modalEmail').text(depData.ultimoStatus.gabinete.email || 'Não disponível');
                        $('#modalSexo').text(depData.sexo === 'M' ? 'Masculino' : 'Feminino');
                        $('#modalEscolaridade').text(depData.escolaridade || 'Não disponível');
                        $('#modalNomeCivil').text(depData.nomeCivil || depData.ultimoStatus.nome);

                        // Mostrar o modal
                        $('#deputadoModal').fadeIn();
                    },
                    error: function(error) {
                        console.error('Erro ao buscar os detalhes do deputado:', error);
                    }
                });
            });
        });

        // Evento para fechar o modal
        $('.l-modal__fechar').on('click', function() {
            $('#deputadoModal').fadeOut();
        });
    },
    error: function(error) {
        console.error('Erro ao buscar os dados:', error);
    }
});
