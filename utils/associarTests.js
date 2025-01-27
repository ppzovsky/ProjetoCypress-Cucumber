const axios = require('axios');
const fs = require('fs');

// Configurações
const org = 'ppzovsky'; // Organização no Azure DevOps
const project = 'Estudos%20iLAB'; // Nome do projeto
const planId = '6'; // ID do plano de testes
const suiteId = '16'; // ID da suíte de testes
const pat = 'DBDTHdJ5GUmVWNQW9Hh6Vm45nnCxq3QAcBfiElBHEn2mx5deODHdJQQJ99BAACAAAAASKsUvAAASAZDO7kI1'; // Token de acesso
const testResultsFile = 'results.json'; // Arquivo de resultados dos testes
const testRunID = ''; //ID do test Run

const auth = {
  username: 'ppzovsky',
  password: pat,
};

// Busca e recupera casos de teste
async function recuperaCasosdeTeste() {
  const url = `https://dev.azure.com/${org}/${project}/_apis/testplan/Plans/${planId}/Suites/${suiteId}/TestCase`;
  try {
    const response = await axios.get(url, { auth });
    // console.log('Casos de teste recuperados com sucesso!', response.data.value);
    return response.data.value;
  } catch (error) {
    console.error('Erro ao buscar casos de teste:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Cria execução uma test run
async function criaTestRun() {
  const url = `https://dev.azure.com/${org}/${project}/_apis/test/runs?api-version=7.1-preview.3`;
  const body = {
    name: `Execução de Testes Automatizados - ${new Date().toISOString()}`,
    plan: {
      id: planId,
    },
  };
  try {
    const response = await axios.post(url, body, { auth });
    console.log('Execução de teste criada com sucesso! ID: '+ response.data.id);
    // testRunID = response.data.id;
    return response.data.id;
  } catch (error) {
    console.error('Erro ao criar execução de teste:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Faz a relação entre o caso no plano de teste e o resultado da execuçãp
async function relacionaCasodeTeste(testRunId, testCases, testResults) {
    const url = `https://dev.azure.com/${org}/${project}/_apis/test/Runs/${testRunId}/results?api-version=7.1-preview.6
`;
  
    // Transformar testResults em um array
    const extractedResults = [];
    Object.entries(testResults).forEach(([filePath, results]) => {
      if (typeof results === 'object' && !results.totals) {
        Object.entries(results).forEach(([testName, outcome]) => {
          extractedResults.push({
            testName,
            outcome,
            filePath,
            duration: 0, 
          });
        });
      }
    });
  
    if (!Array.isArray(extractedResults) || extractedResults.length === 0) {
      console.error('Nenhum resultado de teste encontrado.');
      return;
    }
  
    const results = extractedResults
      .map((result) => {
        const testCase = testCases.find(tc => 'Compra de tickets ' + tc.workItem.name === result.testName);
  
        if (testCase) {
          const now = new Date();
          return {
              "testPoint": { "id": "3" }, 
              "testCase": {
                "id": testCase.workItem.id, 
                "revision": testCase.workItem.revision 
              },
              "testCaseTitle": testCase.workItem.name, 
              "automatedTestName": result.testName,
              "outcome": result.outcome.charAt(0).toUpperCase() + result.outcome.slice(1), // Garantir que a primeira letra seja maiúscula
              "state": "Completed",
              "startedDate": now.toISOString(),
              "completedDate": now.toISOString()
            }        
        }
  
       
        // console.warn(`Caso de teste não encontrado para: "${result.testName}"`);
        return null;
      })
      .filter(Boolean);
  
    if (results.length === 0) {
      console.error('Nenhum resultado de teste pôde ser associado aos casos de teste.');
      return;
    }
  
     console.log('Payload enviado:', results);
  
    try {
      await axios.post(
        url,
        results,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(`:${pat}`).toString('base64')}`,
          },
        }
      );
      console.log('Resultados dos testes associados com sucesso!');
      
    } catch (error) {
      console.error('Erro ao associar resultados:', error.response?.data, error.response?.status);
      throw error;
    }
  }  


async function main() {
  try {
    // Ler resultados dos testes
    const testResults = JSON.parse(fs.readFileSync(testResultsFile, 'utf8'));

    // Buscar casos de teste
    const testCases = await recuperaCasosdeTeste();

    // Criar execução de teste
    const testRunId = await criaTestRun();

    // Associar resultados aos casos de teste
    // console.log('Tipo de testResults:', typeof testResults);
    // console.log('Conteúdo de testResults:', testResults);
    // console.log('Tipo de testCases:', typeof testCases);
    // console.log('Conteúdo de testCases:', testCases);
    await relacionaCasodeTeste(testRunId, testCases, testResults);
  } catch (error) {
    console.error('Erro no processo de associação:');
  }
}

// Executar o script
main();