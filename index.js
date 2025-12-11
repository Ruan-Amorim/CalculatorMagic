
const atualTable = [];

const dataHora = new Date().toLocaleString("pt-BR").replace(",", "").replace(" ", "-").slice(0, 14);

// =============================
// CÁLCULOS
// =============================

// 1. VALOR JUSTO TEÓRICO (Modelo Gordon simplificado)
function calcularValorJusto(dividendo, crescimento, taxa) {
    return dividendo * (1 + crescimento) / (taxa - crescimento);
}

// 2. ROE = Lucro Líquido / Patrimônio Líquido
function calcularROE(lucro, patrimonio) {
    return (lucro / patrimonio) * 100;
}

// 3. Dividend Yield = Dividendos por ação / Cotação Atual
function calcularDividendYield(dividendo, preco) {
    return (dividendo / preco) * 100;
}   
// 4. Retorno sobre Resultados (Lucro / (PL + Dívida Líquida))
function calcularRetornoResultados(lucro, patrimonio, dividaLiquida) {
    return (lucro / (patrimonio + dividaLiquida)) * 100;
}
// 5. ROIC = NOPAT / (Patrimônio Líquido + Dívida Líquida)
function calcularROIC(lucro, patrimonio, dividaLiquida, aliquota) {
    let nopat = lucro * (1 - aliquota);  
    let capitalInvestido = patrimonio + dividaLiquida;
    return (nopat / capitalInvestido) * 100;
}

// ===============================
// START A CALCULADORA
// ===============================

function start() {
    // PEGANDO OS DADOS INSERIDOS
    let codigoAcao = document.getElementById("CodName").value;
    let lucroLiquido = parseFloat(document.getElementById("lucroLiquido").value); // Ex: 3,3 bilhões -> escrever 3300000000
    let patrimonioLiquido = parseFloat(document.getElementById("patrimonioLiquido").value); // Ex: 18,48 bilhões
    let dividaLiquida = parseFloat(document.getElementById("dividaLiquida").value);
    let aliquota = parseFloat(document.getElementById("aliquota").value) / 100;
    let divPorAcao = parseFloat(document.getElementById("divPorAcao").value); // Dividendos pagos por ação (R$)
    let cotacaoAtual = parseFloat(document.getElementById("cotacaoAtual").value); // Cotação da ação
    let crescimento = parseFloat(document.getElementById("crescimento").value) / 100;// Crescimento esperado
    let taxaDesconto = parseFloat(document.getElementById("taxaDesconto").value) / 100; // Taxa de desconto
    
    // ===========================
    // CALCULANDO
    // ===========================
    let valorJusto = calcularValorJusto(divPorAcao, crescimento, taxaDesconto);
    let roe = calcularROE(lucroLiquido, patrimonioLiquido);
    let dividendYield = calcularDividendYield(divPorAcao, cotacaoAtual);
    let retornoResultados = calcularRetornoResultados(lucroLiquido, patrimonioLiquido, dividaLiquida);
    let roic = calcularROIC(lucroLiquido, patrimonioLiquido, dividaLiquida, aliquota);

// ===========================
// SAÍDA
// ===========================
let tabela = document.getElementById("tabelaDeResultados");
let linhaTabela = document.createElement("tr");

// Criar células corretamente
let L1 = document.createElement("td");
L1.innerText = codigoAcao;

let L2 = document.createElement("td");
L2.innerText = "R$"+cotacaoAtual;

let L3 = document.createElement("td");
L3.innerText = "R$"+valorJusto.toFixed(2);

let L4 = document.createElement("td");
L4.innerText = roe.toFixed(2)+"%";

let L5 = document.createElement("td");
L5.innerText = roic.toFixed(2)+"%";

let L6 = document.createElement("td");
L6.innerText = retornoResultados.toFixed(2)+"%";

let L7 = document.createElement("td");
L7.innerText = dividendYield.toFixed(2)+"%";

// Coluna 8 (diferença entre valor justo e cotação)
let L8 = document.createElement("td");

if (valorJusto < cotacaoAtual) {
    L8.innerText = "Caro, com diferença de R$"+(cotacaoAtual - valorJusto).toFixed(2);
} else if (valorJusto == cotacaoAtual) {
    L8.innerText = "Normal R$"+cotacaoAtual.toFixed(2);
} else {
    L8.innerText = " Barato, com diferença de R$"+(valorJusto - cotacaoAtual).toFixed(2);
}

// Adicionar cada <td> na linha
linhaTabela.appendChild(L1);
linhaTabela.appendChild(L2);
linhaTabela.appendChild(L3);
linhaTabela.appendChild(L4);
linhaTabela.appendChild(L5);
linhaTabela.appendChild(L6);
linhaTabela.appendChild(L7);
linhaTabela.appendChild(L8);

// Adicionar linha na tabela
tabela.appendChild(linhaTabela);

// Adicionar na atualTable sem subir para o banco

    atualTable.push({
    code: codigoAcao,
    patrimonio_liquido: patrimonioLiquido,
    cotatacao_atual: cotacaoAtual,
    dy: dividendYield.toFixed(2),
    dividendos_por_acao: divPorAcao,
    lucro_liquido: lucroLiquido,
    data: dataHora,
  });
};

async function addData() {
    try {
        const r = await fetch("https://ruan-amorim.ct.ws/api.php", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(atualTable)
        });
        return await r.json(); // opcional
    } catch (e) {
        console.error("Erro ao enviar dados:", e);
    }
}

function clearData() {
    fetch("https://ruan-amorim.ct.ws/api.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify([])
});
}

async function getData() {
    try {
        const r = await fetch("https://ruan-amorim.ct.ws/api.php");
        const apiData = await r.json();
        return apiData;
    } catch (e) {
        console.error("Erro ao buscar dados:", e);
    }
}
let kirito = document.getElementByTagName("main");
kirito.appendChild(getData());
