import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const host = '0.0.0.0';
const porta = 3000;

let listaUsuarios = [];
let usuarioAutenticado = false;

const app = express();
//configurar o express para manipular corretamente os dados 
//quando eles forem submetidos via método POST
app.use(express.urlencoded({ extended: true })); //habilita a biblioteca QueryString

app.use(session({
    secret: 'ChaveSecreta',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 15
    }
}))

app.use(cookieParser());

function usuarioEstaAutenticado(requisicao, resposta, next) {
    if (requisicao.session.usuarioAutenticado) {
        next();     //permitir que a requisicção continue a ser processada
    }
    else {
        resposta.redirect('/login.html');
    }
}


function cadastrarUsuario(requisicao, resposta) {
    const nome = requisicao.body.nome;
    const sobrenome = requisicao.body.sobrenome;
    const usuario = requisicao.body.usuario;
    const cidade = requisicao.body.cidade;
    const estado = requisicao.body.estado;
    const cep = requisicao.body.cep;

    //verificando se os campos foram preenchidos (não estão vazios)
    if (nome && sobrenome && usuario && cidade && estado && cep) {
        listaUsuarios.push({
            nome: nome,
            sobrenome: sobrenome,
            usuario: usuario,
            cidade: cidade,
            estado: estado,
            cep: cep
        });
        resposta.redirect('/listarUsuarios');
    }
    else {
        resposta.write(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Página de cadastro de usuários</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        </head>
        
        <body>
            <div class="container m-5">
                <form method="POST" action='/cadastrarUsuario' class="border row g-3 needs-validation" novalidate>
                    <legend>Cadastro de Usuários</legend>
                    <div class="col-md-4">
                        <label for="nome" class="form-label">Nome:</label>
                        <input type="text" class="form-control" id="nome" name="nome" value="${nome}" required>`);
        if (nome == "") {
            resposta.write(`
                        <div m-2 class="alert alert-danger" role="alert">
                            Por favor, informe o nome do usuário.
                        </div>
            `);
        }
        resposta.write(`</div>
                        <div class="col-md-4">
                            <label for="sobrenome" class="form-label">Sobrenome</label>
                            <input p-1 type="text" class="form-control" id="sobrenome" name="sobrenome" value="${sobrenome}" required>`);
        if (sobrenome == "") {
            resposta.write(`<div m-2 class="alert alert-danger" role="alert">
                                Por favor, informe o sobrenome do usuário.
                            </div>`);
        }
        resposta.write(`
                        </div>
                        <div class="col-md-4">
                            <label for="usuario" class="form-label">Nome do usuário</label>
                            <div class="input-group has-validation">
                                <span class="input-group-text" id="inputGroupPrepend">@</span>
                                <input type="text" class="form-control" id="usuario" name="usuario" value="${usuario}"
                                aria-describedby="inputGroupPrepend" required>
        `);
        if (usuario == "") {
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, informe o nome de login do usuário.
                            </div>`);
        }
        resposta.write(`    </div>
                        </div>
                        <div class="col-md-6">
                            <label for="cidade" class="form-label">Cidade</label>
                            <input type="text" class="form-control" id="cidade" name="cidade" value="${cidade}" required>`
        );
        if (cidade == "") {
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, informe a cidade do usuário.
                            </div>`);
        }
        resposta.write(`</div>
                        <div class="col-md-3">
                            <label for="estado" class="form-label">UF</label>
                            <select class="form-select" id="estado" name="estado" required>
                                <option selected disabled value=${estado}>Escolha um estado...</option>
                                <option value="AC">AC</option>
                                <option value="AL">AL</option>
                                <option value="AP">AP</option>
                                <option value="AM">AM</option>
                                <option value="BA">BA</option>
                                <option value="CE">CE</option>
                                <option value="DF">DF</option>
                                <option value="ES">ES</option>
                                <option value="GO">GO</option>
                                <option value="MA">MA</option>
                                <option value="MT">MT</option>
                                <option value="MS">MS</option>
                                <option value="MG">MG</option>
                                <option value="PA">PA</option>
                                <option value="PB">PB</option>
                                <option value="PR">PR</option>
                                <option value="PE">PE</option>
                                <option value="PI">PI</option>
                                <option value="RJ">RJ</option>
                                <option value="RN">RN</option>
                                <option value="RS">RS</option>
                                <option value="RO">RO</option>
                                <option value="RR">RR</option>
                                <option value="SC">SC</option>
                                <option value="SP">SP</option>
                                <option value="SE">SE</option>
                                <option value="TO">TO</option>
                            </select>`
        );
        if (!estado) {
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, selecione um estado.
                            </div>`);
        }
        resposta.write(`</div>
                        <div class="col-md-3">
                            <label for="cep" class="form-label">CEP</label>
                            <input type="text" class="form-control" id="cep" name="cep" value="${cep}" required>`);
        if (cep == "") {
            resposta.write(`<div class="alert alert-danger" role="alert">
                                Por favor, informe o cep.
                            </div>`);
        }
        resposta.write(`</div>
                        <div class="col-12 mb-3">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                            <a class="btn btn-secondary" href="/">Voltar</a>                   
                        </div>
                    </form>
                </div>
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
        </html>`);
        resposta.end(); //finaliza o envio da resposta!
    }//fim else

}

//Quando um usuário enviar uma requisição do tipo POST
//para o endpoint 'http://localhost:3000/cadastrarUsuario'
//executa a função 'cadastrarUsuario()'

function autenticarUsuario(requisicao, resposta) {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if (usuario == 'admin' && senha == '123') {
        requisicao.session.usuarioAutenticado = true;
        resposta.cookie('dataUltimoAcesso', new Date().toLocaleDateString(), {
            httpOnly: true,
            maxAge: 1000 * 60 * 60* 24 * 30
        });
        resposta.redirect('/');
    }
    else {
        resposta.write('<p>Usuário ou senha inválidos!</p>');
        resposta.write('<input type="button" value="Voltar" onclick= "history.go(-1)"/>');
        resposta.end();
    }

}
app.post('/login', autenticarUsuario);
app.get('/login', (req, resp) => {
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login.html');
});

app.use(express.static(path.join(process.cwd(), 'publico')));

app.use(usuarioEstaAutenticado, express.static(path.join(process.cwd(), 'protegido')));

app.post('/cadastrarUsuario', usuarioEstaAutenticado, cadastrarUsuario);

app.get('/listarUsuarios', usuarioEstaAutenticado, (req, resp) => {
    resp.write('<html>');
    resp.write('<head>');
    resp.write('<title>Resultado do cadastro</title>');
    resp.write('<meta charset="utf-8">');
    resp.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">')
    resp.write('</head>');
    resp.write('<body>');
    resp.write('<h1>Lista de Usuários</h1>');
    resp.write('<table class="table table-striped">');
    resp.write('<tr>');
    resp.write('<th>Nome</th>');
    resp.write('<th>Sobrenome</th>');
    resp.write('<th>Usuario</th>');
    resp.write('<th>Cidade</th>');
    resp.write('<th>Estado</th>');
    resp.write('<th>CEP</th>');
    resp.write('</tr>');
    for (let i = 0; i < listaUsuarios.length; i++) {
        resp.write('<tr>');
        resp.write(`<td>${listaUsuarios[i].nome}`);
        resp.write(`<td>${listaUsuarios[i].sobrenome}`);
        resp.write(`<td>${listaUsuarios[i].usuario}`);
        resp.write(`<td>${listaUsuarios[i].cidade}`);
        resp.write(`<td>${listaUsuarios[i].estado}`);
        resp.write(`<td>${listaUsuarios[i].cep}`);
        resp.write('</tr>');
    }
    resp.write('</table>');
    resp.write('<a href="/">Voltar</a>');
    resp.write('<p>');
    if(req.cookies.dataUltimoAcesso){

    }
    resp.write('</p>');
    resp.write('</body>');
    resp.write('<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>')
    resp.write('</html>');
    resp.end();
});

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
})