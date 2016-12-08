var db;

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

function atualizarGrid(callback){
    var tabela = document.getElementById("grid");
    tabela.innerHTML = "<tr>"
                            +"<th>Código</th>"
                            +"<th>Nome</th>"
                            +"<th>Ações</th>"
                    +"</tr>";
    
    execute("SELECT rowid, Nome FROM Cliente", null, 
        function(transaction, result){
            with(result)
                for(var i = 0; i < rows.length; i++)
                    tabela.innerHTML += '<tr>'
                                            +'<td>'+rows[i]["rowid"]+'</td>'
                                            +'<td>'+rows[i]["Nome"]+'</td>'
                                            +'<td>'
                                                +'<button data-codigo="'+rows[i]["rowid"]+'" id="btnExcluir'+rows[i]["rowid"]+'" class="botaoExcluir">Excluir</button>'
                                                +'<button data-codigo="'+rows[i]["rowid"]+'" id="btnAlterar'+rows[i]["rowid"]+'" class="botaoAlterar">Alterar</button>'
                                            +'</td>'
                                        +'</tr>';
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
            
            
            if (callback){
                console.log("CallBack = " + callback);
                callback.call();
            }
        }
    );
}

function submitCliente(){
    var codigo = document.getElementById("cCliCodigo").value,   
        nome = document.getElementById("cCliNome").value;
    
    if (codigo == "")        
        execute("INSERT INTO Cliente (Nome) VALUES (?)", [nome], function(transaction, result){
            alert("Adição executada com sucesso!");
            alterarExibicaoDiv();
        });
    else
        execute("UPDATE Cliente SET Nome = ? WHERE rowid = ?", [nome, codigo], function(transaction, result){
            alert("Alteração executada com sucesso!");    
            alterarExibicaoDiv();        
        });
        
}

function btnAlterarClick(){
    console.log("Clicou no Alterar");
    var codigo = this.getAttribute("data-codigo");
    alert("Alterar - Codigo: " + codigo);
}

function btnExcluirClick(){
    var codigo = this.getAttribute("data-codigo");
    execute("DELETE FROM Cliente WHERE rowid = ?", [codigo], function(){
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
    if (divListagem.style.display == "initial"){
        divListagem.style.display = "none"
        divDetalhado.style.display = "initial";
    } 
    else{
        divListagem.style.display = "initial"
        divDetalhado.style.display = "none";
        atualizarGrid(eventosBotoesListagem);
    }
    
}

window.onload = function(){
    open();
    atualizarGrid(eventosBotoesListagem);

    var btnListagem = document.querySelector("#btnListagem"),
        btnDetalhado = document.getElementById("btnDetalhado");
        // btnAdicionar = document.getElementById("btnAdicionar");
    btnListagem.onclick = btnDetalhado.onclick = alterarExibicaoDiv;
    btnAdicionar.onclick = btnAdicionarClick;
}

/* EXEMPLOS ANTIGOS  - NÂO UTILIZADOS */
function criarBotaoExcluir(codigo){
    var att = document.createAttribute("data-codigo");
    att.value = codigo;
    var botao = document.createElement("BUTTON");    
    botao.setAttributeNode(att);
    botao.id = "btnExcluir" + codigo;    
    botao.className = "botaoExcluir";
    botao.innerHTML = "Excluir";
    return botao;
}

function criarBotaoAlterar(codigo){
    var att = document.createAttribute("data-codigo");
    att.value = codigo;
    var botao = document.createElement("BUTTON");
    botao.setAttributeNode(att);
    botao.id = "btnAlterar" + codigo;
    botao.className = "botaoAlterar";
    botao.innerHTML = "Alterar";
    return botao;
}