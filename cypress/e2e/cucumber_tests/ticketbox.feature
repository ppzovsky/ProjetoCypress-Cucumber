Feature: Compra de tickets

  Scenario: Compra de 1 ticket do tipo General Admission usando a opção Friend
    Given que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    And que escolho a quantidade "1", a opcao "#general" e como eu conheci o evento "#friend"
    When confirmo meus tickets
    Then a compra é realizada com sucesso

  Scenario: Compra de 2 ticket do tipo VIP usando a opção Publication
    Given que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    And que escolho a quantidade "2", a opcao "#vip" e como eu conheci o evento "#publication"
    When confirmo meus tickets
    Then a compra é realizada com sucesso

  Scenario: Compra de 3 ticket do tipo VIP usando a opção Social Media
    Given que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    And que escolho a quantidade "3", a opcao "#vip" e como eu conheci o evento "#social-media"
    When confirmo meus tickets
    Then a compra é realizada com sucesso

  Scenario: Compra de 4 ticket do tipo General Admission usando a opção Publication
    Given que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    And que escolho a quantidade "4", a opcao "#general" e como eu conheci o evento "#publication"
    When confirmo meus tickets
    Then a compra é realizada com sucesso

  Scenario: Validar funcionamento do botão Reset
    Given que preencho meus dados pessoais com "Teste", "da Silva" e "teste@teste.gamil.com"
    And que escolho a quantidade "1", a opcao "#general" e como eu conheci o evento "#friend"
    When cancelo meus tickets
    Then a tela inicial reseta todos os campos
