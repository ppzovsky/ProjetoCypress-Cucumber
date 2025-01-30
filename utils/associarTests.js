const axios = require('axios');
const fs = require('fs');

// Configurações
const org = 'iLABLLC'; // Organização no Azure DevOps
const project = 'Portobello%20-%20Migração%20Oracle'; // Nome do projeto
const planId = '1558'; // ID do plano de testes
const suiteId = '1559'; // ID da suíte de testes
const pat = '41AC9RnkhwiJb05J5WqdLWHCbluEq259D1U5DszfIhsgfE4Z75U5JQQJ99BAACAAAAASKsUvAAASAZDOy1fY'; // Token de acesso

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
    // console.log(response.data.value);
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
    // console.log(response.data.value);
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
  const url = `https://dev.azure.com/${org}/${project}/_apis/test/runs?api-version=7.1`;

  for (const result of testRunResults) {
    // Encontrar o caso de teste correspondente
    const testCase = testCases.find(tc => tc.workItem.name === result.automatedTestName);

    if (testCase) {
      const now = new Date();

      // Pegar o primeiro testPoint disponível (se existir)
      const testPoint = testCase.pointAssignments?.[0]?.id;

      if (testPoint) {
        // Construir o objeto do Test Run corretamente
        const resultado = {
          name: result.testCaseTitle,
          automated: true,
          build: {id: result.build.id, name: result.build.name, url: result.build.url},
          pointIds: [testPoint], 
          plan: {
            id: testCase.testPlan.id,
          },
          state: 'InProgress',
          startedDate: now.toISOString(),
          completedDate: now.toISOString()
        };

        try {
          const response = await axios.post(
            url,
            resultado,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${Buffer.from(`:${pat}`).toString("base64")}`,
              },
            }
          );

          console.log(`Resultado do teste "${result.testCaseTitle}" associado com sucesso!`);
          // console.log(response.data);
          await atualizarResultadoTeste(response.data.id, 100000, result.outcome);
          await finalizarTestRun(response.data.id, result.outcome);
        } catch (error) {
          console.error(`Erro ao associar resultado ao teste "${result.testCaseTitle}":`, error.response?.data || error.message);
        }
      } else {
        console.warn(`Test Point não encontrado para "${result.testCaseTitle}"`);
      }
    } else {
      console.warn(`Test Case não encontrado para "${result.automatedTestName}"`);
    }
  }
}

//Funcao para atualizar o resultado do teste (se passou ou falhou)
async function atualizarResultadoTeste(testRunId, testCaseId, result) {
  const url = `https://dev.azure.com/${org}/${project}/_apis/test/Runs/${testRunId}/results?api-version=7.1-preview.6`;
  const body = [{
    id: 100000,
    outcome: result,
    state: 'Completed',
    comment: 'Resultado definido via API'
  }];

  try {
    await axios.patch(url, body, { auth });
  } catch (error) {
    console.error('Erro ao atualizar teste:', error.response?.data || error.message);
  }
}

//Função para retornar o status da execução ao completed
async function finalizarTestRun(testRunId) {
  const url = `https://dev.azure.com/${org}/${project}/_apis/test/runs/${testRunId}?api-version=7.1-preview.3`;
  const body = {
    state: 'Completed',
    comment: 'Resultado definido via API'
  };

  try {
    const response = await axios.patch(url, body, { auth });
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

    //Buscar resultados do test run 
    console.log('Buscando resultados do test run...')
    const testRunResults = await buscarResultadosTestRun(testRunId);

    // Buscar casos de teste no plano
    console.log('Buscando casos de teste...')
    const testCases = await buscarCasosDeTeste();

    // Associa os resultados aos casos de teste
    console.log('Associando resultados aos casos de teste...')
    await associarResultados(testRunResults, testCases);

  } catch (error) {
    console.error('Erro no processo:', error.message);
  }
}

main();
