// describe('Teste arquivo zippado', () => {
//     it('Validar post do arquivo na API', () => {
//       // Carregar o arquivo como binário
//       cy.fixture('massa.zip', 'binary').then((fileContent) => {
//         // Converter o conteúdo do arquivo em um Blob
//         const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'application/zip');
        
//         // Criar o FormData para enviar o arquivo
//         const formData = new FormData();
//         formData.append('file', blob, 'massa.zip');
  
//         // Fazer a requisição POST para o upload
//         cy.request({
//           method: 'POST',
//           url: 'https://file.io', // URL da API
//           body: formData, // Corpo com o arquivo
//           headers: {
//             'Content-Type': 'multipart/form-data', // Formato para upload de arquivos
//           },
//           encoding: 'binary', // Tratando resposta como binária
//         }).then((response) => {
//           // Verificar o status da resposta
//           expect(response.status).to.eq(200);
          
//           // Verificar se a resposta contém o JSON esperado com a chave
//           const textDecoder = new TextDecoder('utf-8');
//           const responseText = textDecoder.decode(response.body);
//         //   const responseText = JSON.stringify(response.body);
//           cy.log('Resposta: ', responseText); // Log da resposta
//           console.log('Resposta: ', responseText); // Log no console
          
//           // Validar se a resposta tem a chave 'key' e a URL de link
//           expect(responseText).to.have.property('key');
//           expect(responseText).to.have.property('link');
          
//         //   // Teste adicional, você pode usar a URL da resposta para validar o link gerado
//         //   cy.request(response.body.link).then((linkResponse) => {
//         // //     expect(linkResponse.status).to.eq(200); // Verificar se o link funciona
//         //   });
//         });
//       });
//     });
//   });
  

  
// describe('Teste de geração e validação de token', () => {
//     it('Gerar e salvar token', () => {
//         cy.readFile('token.json').then((tokenData) => {
//             const tokenDataJson = JSON.parse(tokenData);
//             const now = new Date();
//             const dataAtual = now.toLocaleString();

//             if (tokenDataJson && tokenDataJson.token && tokenDataJson.horario) {
//                 cy.log('Token já existe no arquivo JSON.');
//                 expect(tokenDataJson).to.have.property('token');
//                 expect(tokenDataJson).to.have.property('horario');
//             } else {
//                 cy.request({
//                     method: 'POST',
//                     url: 'YOUR_API_ENDPOINT', // Substitua pela URL da sua API
//                     body: { /* Dados para requisição */ },
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 }).then((response) => {
//                     expect(response.status).to.eq(200);
//                     expect(response.body).to.have.property('token');
//                     const newTokenData = {
//                         token: response.body.token,
//                         horario: dataAtual
//                     };
//                     cy.writeFile('token.json', JSON.stringify(newTokenData, null, 2));
//                 });
//             }
//         });
//     });
// });
