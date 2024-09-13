class RecintosZoo {

    analisaRecintos(animal, quantidade) {  
        const recintosViaveis = []
        const recintos =
            [
                { numero: 1, bioma: ['SAVANA'], tamanho: 10, animaisPresentes: { MACACO: 3 } },
                { numero: 2, bioma: ['FLORESTA'], tamanho: 5, animaisPresentes: {} },
                { numero: 3, bioma: ['SAVANA', 'RIO'], tamanho: 7, animaisPresentes: { GAZELA: 1 } },
                { numero: 4, bioma: ['RIO'], tamanho: 8, animaisPresentes: {} },
                { numero: 5, bioma: ['SAVANA'], tamanho: 9, animaisPresentes: { LEAO: 1 } }
            ]

        const animais =
        {
            LEAO: { tamanho: 3, bioma: ['SAVANA'], carnivoro: true },
            LEOPARDO: { tamanho: 2, bioma: ['SAVANA'], carnivoro: true },
            CROCODILO: { tamanho: 3, bioma: ['RIO'], carnivoro: true },
            MACACO: { tamanho: 1, bioma: ['SAVANA', 'FLORESTA'], carnivoro: false },
            GAZELA: { tamanho: 2, bioma: ['SAVANA'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, bioma: ['SAVANA', 'RIO'], carnivoro: false }
        }

        animal = normalizaEntrada(animal)

        function validaEntrada(animal, quantidade) {
            //animal tem que corresponder a uma key valida em animais
            if (!animais[animal]) {
                return { erro: "Animal inválido" };
            }
            //quantidade tem que ser um numero inteiro maior que 0
            if (typeof quantidade !== 'number' || quantidade < 1 || !Number.isInteger(quantidade)) {
                return { erro: "Quantidade inválida" };
            }
        }
        function encontraRecintosViaveis() {
            recintos.forEach((recinto) => {
                //itera sobre cada recinto da array recintos e testa se algum recinto tem o mesmo bioma que o bioma do animal requerido
                const biomaCombina = recinto.bioma.some((bioma) => animais[animal].bioma.includes(bioma))
                if (!biomaCombina) return;

                //desconstroi o par [key: value] do objeto 'animaisPresentes' do recinto atual (ex: ['MACACO', 3] = {MACACO: 3}
                const animaisPresentes = Object.entries(recinto.animaisPresentes)

                //calcula o espaço já ocupado. O acumulador começa em 0, o método desconstrói a array criada em animaisPresentes e atribui
                //estes valores aos parametros [animal, qnt], que são utilizados para obter o tamanho do animal na array animais e a quantidade
                //deste animal no recinto para calcular o total já ocupado, este valor será usado posteriormente para validar o recinto por espaço
                const espacoOcupado = animaisPresentes.reduce((acumulador, [animal, qnt]) => {
                    return acumulador + (animais[animal].tamanho * qnt)
                }, 0)

                //animais carnivoros só podem viver com a mesma espécie
                if (animais[animal].carnivoro && animaisPresentes.length > 0) {
                    let apenasMesmaEspecie = animaisPresentes.every(([especie]) => especie === animal)
                    if (!apenasMesmaEspecie) return;
                }

                //checa se os animais podem coexistir
                if (animaisPresentes.length > 0 && !podemCoexistir(recinto, animal)) return;

                let espacoLivre;
                //calcula espaço livre restante
                let apenasMesmaEspecie = animaisPresentes.every(([especie]) => especie === animal)
                if (apenasMesmaEspecie) {
                    espacoLivre = recinto.tamanho - (espacoOcupado + (animais[animal].tamanho * quantidade))
                } else 
                    espacoLivre = recinto.tamanho - ((espacoOcupado + (animais[animal].tamanho * quantidade)) + 1)
                if (espacoLivre >= 0) {
                    recintosViaveis.push({numero: recinto.numero, espacoLivre: espacoLivre, total: recinto.tamanho})
                }
            })
        }

        //esta helper function checa se o novo animal se sentira satisfeito no recinto baseado nos animais já presentes
        function podemCoexistir(recinto, animal) {
            const animaisPresentes = Object.entries(recinto.animaisPresentes);
            if (animaisPresentes.length === 0) {
                return true;
            }
            
            if (animal === 'HIPOPOTAMO' && !(recinto.bioma.includes('SAVANA') && recinto.bioma.includes('RIO'))) {
                return false;
            }
            if (animal === 'MACACO' && !animaisPresentes.length === 0) {
                return false;
            }
            if (!animais[animal].carnivoro && animaisPresentes.some(([especie]) => animais[especie].carnivoro)) {
                return false;
            }
            return true;
        }

        function normalizaEntrada(str) {
            return str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') //remove acentos
                .toUpperCase(); //coloca em caixa alta
        }

        const erro = validaEntrada(animal, quantidade)
        if (erro) return erro;

        encontraRecintosViaveis();

        if (recintosViaveis.length < 1) {
            return { erro: "Não há recinto viável" }
        }
        return {
            recintosViaveis: recintosViaveis.map((recinto) => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.total})`)
        } 
        ;
    }
}
export { RecintosZoo as RecintosZoo };
