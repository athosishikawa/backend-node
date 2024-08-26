const express = require('express')  //importando o express
app = express()  //instância do express (new)
var cors = require('cors')  //para liberar acesso externo ao servidor
var bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json('application/json'));

const API_KEY = 'b83c004f5b194bb6a5da970cbd8c71da'
const DNS = 'https://api.themoviedb.org/3'

const categories = [
    {
        name: "trending",
        title: "Em Alta",
        path: "/trending/all/week?api_key="+API_KEY+"&language=pt-BR",
        isLarge: true,
    },
    {
        name: "netflixOriginals",
        title: "Originais Netflix",
        path: "/discover/tv?api_key="+API_KEY+"&with_networks=213",
        isLarge: false,
    },
    {
        name: "topRated",
        title: "Populares",
        path: "/movie/top_rated?api_key="+API_KEY+"&language=pt-BR",
        isLarge: false,
    },
    {
        name: "comedy",
        title: "Comédias",
        path: "/discover/tv?api_key="+API_KEY+"&with_genres=35",
        isLarge: false,
    },  
    {
        name: "romances",
        title: "Romances",
        path: "/discover/tv?api_key="+API_KEY+"&with_genres=10749",
        isLarge: false,
    },                
    {
        name: "documentaries",
        title: "Documentários",
        path: "/discover/tv/api_key="+API_KEY+"&with_genres=99",
        isLarge: false,
    }
]

const getData = async (path) => {
    try {
        const URI = DNS + path;
        const result = await fetch(URI);
        const data = await result.json();
        console.log("Dados recebidos: ", data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Rota genérica para buscar dados da API TMDB com path dinâmico
app.get('/api/movies', async (req, res) => {
    const path = req.query.path; // Obter o path da query string
    if (!path) {
        return res.status(400).send("Path is required");
    }
    
    try {
        const data = await getData(path);
        res.json(data);  // Envia os dados de volta ao frontend
    } catch (error) {
        res.status(500).send("Erro ao buscar dados");
    }
});


// Rota para buscar dados da API TMDB e enviar para o frontend
app.get('/api/movies/trending', async (req, res) => {
    try {
        const data = await getData(categories[0].path);
        res.json(data);  // Envia os dados de volta ao frontend
    } catch (error) {
        res.status(500).send("Erro ao buscar dados");
    }
});

//Envia a lista de categorias
app.get('/api/categories', (req, res) => {
    res.json(categories); // Send the categories array as JSON
  });





// var express = require('express')
const session = require('express-session');
// var cors = require('cors')
const jwt = require("jsonwebtoken");

// var app = express()
const secretKey = "your-secret-key";

//configurações da aplicação
// app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  }));

//emulando banco de dados
var dados = {
    usuarios: [
        {id: '1', nome:'Teste da Silva', email: 'teste@teste.com', senha: '1234', idade: '18'},        
    ]
}

//Função para gerar o token de acesso da sessão
const generateToken = (userID) => {
    return jwt.sign({userID}, secretKey, { expiresIn: 60 * 60});
};

//checagem de token de acesso
function verifyJWT(req, res, next){
    console.log('verify ', req.body)
    let token = req.body.sessionID
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, secretKey, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva na sessão para uso posterior
      req.session.usuarioID = decoded.userID;
      console.log('verify: ', req.session)
      next();
    });
}

//função para carregar dados do usuario a partir do ID
function findUserByID(userID){
    let encontrado = {}
    
    dados.usuarios.forEach((usuario)=>{
        console.log(usuario.id, userID)
        if(usuario.id==userID){
            encontrado = usuario
        }
    })
    
    return encontrado
}

app.post('/login', (req, res, next)=>{

    //o que veio de dados do front
    console.log( req.body)
 
    let logado = false
    let usuarioLogado = {}
    dados.usuarios.forEach((usuario)=>{
        if(usuario.email==req.body.email && usuario.senha==req.body.senha){
            logado = true
            usuarioLogado = usuario
        }
    })

    if(logado){
        //obter a sessao
        const sessionData = req.session;
        //gravar o id do usuario logado na sessao
        req.session.isLogado = true;
        req.session.usuarioID = usuarioLogado.id;
        console.log('login ', req.session)
        //gerar o token da sessão
        const token = generateToken(usuarioLogado.id);
        res.send({sessionID: token})        
    }else{
        res.send('Error....')
    }
        
})

app.post('/test', verifyJWT, (req, res, next)=>{

    //recuperar dados a sessão
    const sessionData = req.session;
    console.log('test ', sessionData)

    //com id correto posso buscar o resto das informações do usuario
    let usuario = findUserByID(sessionData.usuarioID)
    console.log(usuario)
    res.send(usuario.nome)
})


app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
 




