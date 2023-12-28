import { GitHubUser } from "./GitHubUser.js";
//Classe que ira conter a logica dos dados//
export class Favorites {
  //esse root é o app do meu HTML//
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
    this.checkFavorites();
  }
  //função load para carregamento dos dados//
  removeBottomFavorites() {
    this.hTwo = this.root.querySelector("h2");
    this.hTwo.classList.toggle("invisible");
  }
  load() {
    this.tbody = this.root.querySelector("table tbody");
    this.entries =
      JSON.parse(localStorage.getItem("@github-favorites:")) || [].length;
  }
  checkFavorites() {
    if (this.entries.length === 0) {
      this.removeBottomFavorites();
    }
  }
  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }
  async add(username) {
    try {
      const useExists = this.entries.find((entry) => entry.login === username);
      if (useExists) {
        throw new Error("User already registered");
      }
      const user = await GitHubUser.search(username);
      if (user.login === undefined) {
        throw new Error("User not found!");
      }
      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }
  delete(user) {
    // neste bloco o filter vai excluir a linha que lhe for passada atraves do retorno falso  //
    const filteredEntries = this.entries.filter(
      (entry) => entry.login != user.login
    );
    //se retornar falso ele retira do array se for verdadeiro ele coloca no arrray//
    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}
//Classe que irá criar a visualização e eventos do HTML//
export class FavoritesView extends Favorites {
  constructor(root) {
    //criando a conecção entrea as duas classes//
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.hTwo = this.root.querySelector("h2");
    this.update();
    this.onAdd();
  }

  onAdd() {
    const addBottom = this.root.querySelector(".inputs Button");
    addBottom.onclick = () => {
      const { value } = this.root.querySelector(".inputs input");
      this.checkFavorites();
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();
    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = ` imagem de ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha ?");
        if (isOk) {
          this.delete(user);
          this.checkFavorites();
        }
      };

      this.tbody.append(row);
    });
  }

  createRow() {
    //criando a parte de contrução da linha com html, O TR tem que ser criado com a DOM. O tr sera o container que vai conter to o conteudo  //
    const tr = document.createElement("tr");
    //colocar o conteudo dentro do elemnto tr que foi criado pela DOM
    tr.innerHTML = `

      <td class="user">
        <img src="https://github.com/pedroqueirozs.png" alt="" />
        <a href="https://github.com/pedroqueirozs">
          <p>Pedro Queiroz</p>
          <span>pedroqueirozs</span>
        </a>
      </td>
    
      <td class="repositories">80</td>
      <td class="followers">86</td>
      <td class="remove">remover</td>
  
      `;

    return tr;
  }
  //Funçao que faz a remoção da linha( o programa ja inicia com ela sendo executada, sendo chamada na função Update)
  removeAllTr() {
    //forEach executara a funcao que lhe for passada para cada um dos trs da tabela//
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
