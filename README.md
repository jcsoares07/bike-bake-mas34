# 🚲 Bike&Bake

**Combate ao Desperdício Alimentar em Aveiro**

O **Bike&Bake** é uma aplicação web (protótipo funcional) desenvolvida com o objetivo de conectar estabelecimentos locais (padarias e pastelarias) a consumidores, permitindo a venda de excedentes alimentares a preços reduzidos. A plataforma incentiva a sustentabilidade ambiental ao oferecer opções de entrega por bicicleta (estafetas BUGA/locais).

Este projeto foi desenvolvido como entrega final para a disciplina de **Modelação e Análise de Sistemas (MAS)** na **Universidade de Aveiro**.

## ✨ Funcionalidades Principais

- **Exploração e Pesquisa:** Vista em lista e mapa dinâmico (integrado via Leaflet) para descobrir os estabelecimentos aderentes mais próximos na região de Aveiro.
- **Filtros Avançados:** Filtragem detalhada por horário de recolha, preço máximo, categoria, opções veganas e sem glúten.
- **Carrinho e Checkout:** Sistema de "sacola" com cálculo automático de subtotais, taxas de entrega (opção de entrega por bicicleta ou recolha em loja) e aplicação de descontos.
- **Histórico e Avaliações:** Registo de encomendas anteriores e sistema de classificação (1 a 5 estrelas) dos excedentes salvos.
- **Bike&Bake Premium:** Simulação de uma subscrição que oferece entregas de bicicleta gratuitas e descontos extra em todas as sacolas.
- **Persistência de Dados:** Autenticação simulada e gestão de estado (carrinho, contas de utilizador, histórico e definições) realizada localmente através da API `localStorage` do browser.

## 🛠️ Tecnologias Utilizadas

- **Interface:** HTML5, CSS3 (Variáveis CSS, Flexbox) e JavaScript Vanilla.
- **Mapas:** [Leaflet.js](https://leafletjs.com/) em conjunto com tiles do OpenStreetMap para renderização do mapa interativo.
- **Ícones:** [Lucide Icons](https://lucide.dev/).
- **Tipografia:** Família tipográfica *Plus Jakarta Sans* (Google Fonts).

## 🚀 Como Executar o Projeto

Dado que o projeto é um protótipo frontend sem dependências de servidor nesta fase, a execução é direta:

1. Clone este repositório para a sua máquina local.
2. Navegue até à pasta do projeto.
3. Abra o ficheiro `index.html` diretamente num browser web moderno, ou utilize uma extensão como o *Live Server* no VS Code para uma melhor experiência (hot-reloading).

## 👥 Autores

* **João Soares** [132389]
* **João Andrade** [132517]
* **Mariana Tavares** [131790]
* **Pedro Ferreira** [132591]

Universidade de Aveiro - Departamento de Eletrónica, Telecomunicações e Informática (DETI).

---
*Salva excedentes para evitares o desperdício!*
