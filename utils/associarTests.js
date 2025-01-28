const axios = require('axios');
const fs = require('fs');

// Configurações
const org = 'ppzovsky'; // Organização no Azure DevOps
const project = 'Estudos%20iLAB'; // Nome do projeto
const planId = '6'; // ID do plano de testes
const suiteId = '16'; // ID da suíte de testes
const pat = 'DBDTHdJ5GUmVWNQW9Hh6Vm45nnCxq3QAcBfiElBHEn2mx5deODHdJQQJ99BAACAAAAASKsUvAAASAZDO7kI1'; // Token de acesso

const auth = {
  username: 'ppzovsky',
  password: pat,
};

// Função para buscar test runs
async function buscarTestRuns() {
  const url = `https://dev.azure.com/${org}/${project}/_apis/test/runs?api-version=7.1-preview.3`;
  try {
    const response = await axios.get(url, { auth });
    console.log('Test runs encontrados:');
    console.log(response.data.value);
    return response.data.value; // Retorna todos os test runs
  } catch (error) {
    console.error('Erro ao buscar test runs:', error.response?.data || error.message);
    throw error;
  }
}

// Função para buscar resultados de um test run
async function buscarResultadosTestRun(testRunId) {
  const url = `https://dev.azure.com/${org}/${project}/_apis/test/runs/${testRunId}/results?api-version=7.1-preview.6`;
  try {
    const response = await axios.get(url, { auth });
    console.log('Resultados do test run encontrados');
    console.log(response.data.value);
    return response.data.value; // Retorna os resultados
  } catch (error) {
    console.error('Erro ao buscar resultados do test run:', error.response?.data || error.message);
    throw error;
  }
}

//Funcao que muda o status de um testrun (o que permite que eu faca atualizacoes nela)
async function reabrirTestRun(testRunId) {
  const url = `https://dev.azure.com/${org}/${project}/_apis/test/runs/${testRunId}?api-version=7.1-preview.3`;
  const body = {
    state: 'InProgress',
  };

  try {
    await axios.patch(url, body, { auth });
    console.log(`Test run ${testRunId} reaberto com sucesso.`);
  } catch (error) {
    console.error('Erro ao reabrir o test run:', error.response?.data || error.message);
    throw error;
  }
}

// Função para buscar casos de teste no plano
async function buscarCasosDeTeste() {
  const url = `https://dev.azure.com/${org}/${project}/_apis/testplan/Plans/${planId}/Suites/${suiteId}/TestCase`;
  try {
    const response = await axios.get(url, { auth });
    console.log('Casos de teste encontratos');
    // console.log(response.data.value);
    return response.data.value; // Retorna os casos de teste
  } catch (error) {
    console.error('Erro ao buscar casos de teste:', error.response?.data || error.message);
    throw error;
  }
}

// Função para associar os resultados
async function associarResultados(testRunResults, testCases) {

  const url = `https://dev.azure.com/${org}/${project}/_apis/test/runs/${testRunResults[0].testRun.id}/results?api-version=7.1-preview.6`;
  // console.log(testRunResults)

  const results = testRunResults
    .map((result) => {
      // Encontrar o caso de teste correspondente
      const testCase = testCases.find(tc => tc.workItem.name === result.automatedTestName);

      if (testCase) {
        const now = new Date();

        //o testpoint é um marcados dos casos de teste que define suas execuções
        const testPoint = testCase.pointAssignments[0].id;


        if (testPoint) {
          //quando ele existe posso atribuir ele a execução desejada
          return {
            id: result.id,
            project: {
              id: testCase.project.id,
              name: testCase.project.name,
            },
            priority: testCase.workItem.priority,
            testPoint: { id: testPoint },
            testCase: {
              id: testCase.workItem.id,
              revision: testCase.workItem.revision
            },
            testCaseTitle: testCase.workItem.name,
            automatedTestName: result.testCaseTitle,
            outcome: result.outcome,
            state: "Completed",
            startedDate: now.toISOString(),
            completedDate: now.toISOString()
          };
        }
      }
      return null;
    })
    .filter(Boolean);

   
  if (results.length === 0) {
    console.error('Nenhum resultado de teste pôde ser associado aos casos de teste.');
    return;
  }

  console.log('Payload enviado:', results);

  try {
    const response = await axios.patch(
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
    console.log(response.data);
  } catch (error) {
    console.error('Erro ao associar resultados:', error.response?.data || error.message);
    throw error;
  }
}


//Função para retornar o status da execução ao completed
async function finalizarTestRun(testRunId) {
  const url = `https://dev.azure.com/${org}/${project}/_apis/test/runs/${testRunId}?api-version=7.1-preview.3`;
  const body = {
    state: 'Completed',
  };

  try {
    await axios.patch(url, body, { auth });
    console.log(`Test run ${testRunId} finalizado com sucesso.`);
  } catch (error) {
    console.error('Erro ao finalizar o test run:', error.response?.data || error.message);
    throw error;
  }
}


async function main() {
  try {
    // Buscar test runs
    console.log('Buscando test runs...')
    const testRuns = await buscarTestRuns();

    // Pega o o ultimo test run executado
    const lastTestRun = testRuns
    .sort((a, b) => b.id - a.id)[0];

    const testRunId = lastTestRun.id;

    // Buscar resultados do test run 
    console.log('Buscando resultados do test run...')
    const testRunResults = await buscarResultadosTestRun(testRunId);

    //Muda o status do test run para fazer a associacao 
    console.log('Abrindo test run...')
    await reabrirTestRun(testRunId);

    // Buscar casos de teste no plano
    console.log('Buscando casos de teste...')
    const testCases = await buscarCasosDeTeste();

    // Associa os resultados aos casos de teste
    console.log('Associando resultados aos casos de teste...')
    await associarResultados(testRunResults, testCases);

    //Finalizando test run
    console.log('Fechando execucao do teste')
    await finalizarTestRun(testRunId);

  } catch (error) {
    console.error('Erro no processo:', error.message);
  }
}

main();
