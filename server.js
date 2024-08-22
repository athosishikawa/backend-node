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


app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});



 




