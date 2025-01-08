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

            // Adiciona os elementos criados ao item do deputado
            deputadoItem.append(deputadoFoto, deputadoNome, deputadoPartido);

            // Adiciona o item à listagem de deputados
            deputadosListagem.append(deputadoItem);
        });
    },
    error: function(error) {
        console.error('Error fetching data:', error);
    }
});
