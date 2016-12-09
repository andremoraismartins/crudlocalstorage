var db;
//Banco de dados
function open(){
    db = openDatabase("crudLocalStorageBD", "1.0", "Crud Web SQL", 200000);
    if(!db){
        console.log("Não foi possível conectar ao banco de dados!");
    }
}
function execute(sql, params, sucesso){
    if (!db)
        return null;
    else
        db.transaction(function(transaction){
            transaction.executeSql(sql, params, sucesso, alertarErros);
        });
}
function createClienteTable(){
    //Codigo INTEGER PRIMARY KEY AUTOINCREMENT
    console.log(execute("CREATE TABLE Cliente (Nome TEXT)", null, null, null));
}        
function alertarErros(transaction, result){
    alert("Ocorreu um erro inesperado! " + result);
}

//Click dos Botões
function submitCliente(){
    var codigo = document.getElementById("cCodigo").value,   
        nome = document.getElementById("cNome").value;
    if (nome != "")
        if (codigo == "")        
            execute("INSERT INTO Cliente (Nome) VALUES (?)", [nome], 
                function(transaction, result){
                    alert("Adição executada com sucesso!");
                    alterarExibicaoDiv();
                });
        else
            execute("UPDATE Cliente SET Nome = ? WHERE rowid = ?", [nome, codigo], 
                function(transaction, result){
                    alert("Alteração executada com sucesso!");    
                    alterarExibicaoDiv();        
                });
    else
        alert("É obrigatório preencher o nome do cliente!");        
}
function btnAlterarClick(){
    var codigo = this.getAttribute("data-codigo");
    execute("SELECT rowid, Nome FROM Cliente WHERE rowid = ?", [codigo], 
        function(transaction, result){            
            with(result)
                if (rows.length == 1){
                    alterarExibicaoDiv();
                    var txtCodigo = document.getElementById("cCodigo"),
                        txtNome = document.getElementById("cNome"),
                        btnSubmit = document.getElementById("btnSubmit");
                    txtCodigo.value = rows[0]["rowid"];
                    txtNome.value = rows[0]["Nome"];
                    btnSubmit.value = "Salvar";
                }
                else
                    console.log("Registro não encontrado!");
        });
}
function btnExcluirClick(){
    var codigo = this.getAttribute("data-codigo");
    if (confirm("Deseja realmente excluir esse item?"))
        execute("DELETE FROM Cliente WHERE rowid = ?", [codigo], 
            function(){
                alert("Exclusão executada com sucesso!");
                atualizarGrid(eventosBotoesListagem);
            });
}
function eventosBotoesListagem(){
        var botoesExcluir = document.querySelectorAll(".botaoExcluir"),
            botoesAlterar = document.getElementsByClassName("botaoAlterar");
        for(i in botoesExcluir)
            botoesExcluir[i].onclick = btnExcluirClick;
        for(i in botoesAlterar)
            botoesAlterar[i].onclick = btnAlterarClick;
}

function alterarExibicaoDiv(){
    var divListagem = document.getElementById("divListagem"),
        divDetalhado = document.getElementById("divDetalhado");
    if (divListagem.style.display == "" || divListagem.style.display == "inline-block"){
        divListagem.style.display = "none"
        divDetalhado.style.display = "inline-block";
    } 
    else{
        divListagem.style.display = "inline-block"
        divDetalhado.style.display = "none";
        atualizarGrid(eventosBotoesListagem);
    }
    limparCampos();    
}
function atualizarGrid(callback){
    var tabela = document.getElementById("gridCorpo");
    tabela.innerHTML = "";    
    execute("SELECT rowid, Nome FROM Cliente", null, 
        function(transaction, result){
            with(result)
                for(var i = 0; i < rows.length; i++)
                    tabela.innerHTML += '<tr>'
                                            +'<td>'+rows[i]["rowid"]+'</td>'
                                            +'<td>'+rows[i]["Nome"]+'</td>'
                                            +'<td>'
                                                +'<input type="button" data-codigo="'+rows[i]["rowid"]+'" id="btnAlterar'+rows[i]["rowid"]+'" class="botaoAlterar" value="Alterar">'
                                                +'<input type="button" data-codigo="'+rows[i]["rowid"]+'" id="btnExcluir'+rows[i]["rowid"]+'" class="botaoExcluir" value="Excluir">'
                                            +'</td>'
                                        +'</tr>';
            if (callback)
                callback.call();
        }
    );
}
function limparCampos(){
    var txtCodigo = document.getElementById("cCodigo"),
        txtNome = document.getElementById("cNome"),
        btnSubmit = document.getElementById("btnSubmit");

    txtCodigo.value = "";
    txtNome.value = "";
    btnSubmit.value = "Adicionar";
}

//LOAD DA PAGINA ATUALIZA O GRID E ATRIBUI EVENTOS AOS COMPONENTES
window.onload = function(){
    open();
    atualizarGrid(eventosBotoesListagem);

    var btnListagem = document.querySelector("#btnListagem"),
        btnDetalhado = document.getElementById("btnDetalhado"),
        btnSubmit = document.getElementById("btnSubmit");
    btnListagem.onclick = btnDetalhado.onclick = alterarExibicaoDiv;
    btnSubmit.onclick = submitCliente;
}

/* EXEMPLOS ANTIGOS  - NÂO UTILIZADOS */
// function criarBotaoExcluir(codigo){
//     var att = document.createAttribute("data-codigo");
//     att.value = codigo;
//     var botao = document.createElement("BUTTON");    
//     botao.setAttributeNode(att);
//     botao.id = "btnExcluir" + codigo;    
//     botao.className = "botaoExcluir";
//     botao.innerHTML = "Excluir";
//     return botao;
// }
// function criarBotaoAlterar(codigo){
//     var att = document.createAttribute("data-codigo");
//     att.value = codigo;
//     var botao = document.createElement("BUTTON");
//     botao.setAttributeNode(att);
//     botao.id = "btnAlterar" + codigo;
//     botao.className = "botaoAlterar";
//     botao.innerHTML = "Alterar";
//     return botao;
// }
//CRIAR AS LINHAS DA TABELA ATRAVES DE NODES
// var table = document.getElementById("grid"),
//     tr = document.createElement("TR"),
//     tdCodigo = document.createElement("td"),
//     tdNome = document.createElement("td"),
//     tdAcoes = document.createElement("td");
// tdCodigo.innerHTML = rows[i]["rowid"];
// tdNome.innerHTML = rows[i]["Nome"];
// tdAcoes.appendChild(criarBotaoExcluir(rows[i]["rowid"]));
// tdAcoes.appendChild(criarBotaoAlterar(rows[i]["rowid"]));
// tr.appendChild(tdCodigo);
// tr.appendChild(tdNome);
// tr.appendChild(tdAcoes);
// table.appendChild(tr);