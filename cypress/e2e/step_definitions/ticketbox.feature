Feature: Testes compra de tickets

Scenario: Compra de 1 ticket do tipo General Admission usando a opção Friend
Given que preencho meus dados pessoais
And que escolho a quantidade, a opcao e como eu conheci o evento
When confirmo meus tickets
Then a compra é realizada com sucesso