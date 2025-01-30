#language: pt
Funcionalidade: Compra de tickets

  @15
  Cenário: Compra de 1 ticket do tipo General Admission usando a opção Friend
    Dado que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    E que escolho a quantidade "1", a opcao "#general" e como eu conheci o evento "#friend"
    Quando confirmo meus tickets
    Então a compra é realizada com sucesso

  @17
  Cenário: Compra de 2 ticket do tipo VIP usando a opção Publication
    Dado que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    E que escolho a quantidade "2", a opcao "#vip" e como eu conheci o evento "#publication"
    Quando confirmo meus tickets
    Então a compra é realizada com sucesso

  @18
  Cenário: Compra de 3 ticket do tipo VIP usando a opção Social Media
    Dado que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    E que escolho a quantidade "3", a opcao "#vip" e como eu conheci o evento "#social-media"
    Quando confirmo meus tickets
    Então a compra é realizada com sucesso

  @19
  Cenário: Compra de 4 ticket do tipo General Admission usando a opção Publication
    Dado que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    E que escolho a quantidade "4", a opcao "#general" e como eu conheci o evento "#publication"
    Quando confirmo meus tickets
    Então a compra é realizada com sucesso

  @20
  Cenário: Validar funcionamento do botão Reset
    Dado que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    E que escolho a quantidade "1", a opcao "#general" e como eu conheci o evento "#friend"
    Quando cancelo meus tickets
    Então a tela inicial reseta todos os campos
