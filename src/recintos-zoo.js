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
            if (!animais[animal]) {
                return { erro: "Animal inválido" };
            }
            if (typeof quantidade !== 'number' || quantidade < 1 || !Number.isInteger(quantidade)) {
                return { erro: "Quantidade inválida" };
            }y
        }
        function encontraRecintosViaveis() {
            recintos.forEach((recinto) => {

                const biomaCombina = recinto.bioma.some((bioma) => animais[animal].bioma.includes(bioma))
                if (!biomaCombina) return;

                const animaisPresentes = Object.entries(recinto.animaisPresentes)

                const espacoOcupado = animaisPresentes.reduce((acumulador, [animal, qnt]) => {
                    return acumulador + (animais[animal].tamanho * qnt)
                }, 0)

                if (animais[animal].carnivoro && animaisPresentes.length > 0) {
                    let apenasMesmaEspecie = animaisPresentes.every(([especie]) => especie === animal)
                    if (!apenasMesmaEspecie) return;
                }

                if (animaisPresentes.length > 0 && !podemCoexistir(recinto, animal)) return;

                let espacoLivre;
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
                .replace(/[\u0300-\u036f]/g, '')
                .toUpperCase(); 
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
