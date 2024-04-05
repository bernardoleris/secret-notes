import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

let titles = [];
let posts = [];
var userAutorizado = false;
var num = 0;

function passwordCheck(req, res, next){
    const password = req.body["password"];
    if(password==="working"){
        userAutorizado = true;
    }
    next();
}

app.use(passwordCheck);

app.get("/", (req, res)=>{
    const error = "Erro ao processar a solicitação.";
    res.render("index.ejs", { error: error, num:0 });
});

app.get("/notes", (req,res)=>{
    res.render("notes.ejs", {
        titles: titles,
        posts: posts
    });
});

app.get("/edit/:postId", (req, res) => {
    const postId = req.params.postId;
    const title = titles[postId];
    const post = posts[postId];

    res.render("edit.ejs", { postId: postId, post: post, title: title });
});

app.post("/", (req, res)=>{
    if(userAutorizado===true){
        res.render("notes.ejs", {
            titles: titles,
            posts: posts
        });
        userAutorizado = false;
        num = 0;
    }else{
        num++;
        res.render("index.ejs", { error: "Senha incorreta. Tente novamente.", num: num });
    }
});

app.post("/submit", (req,res)=>{
    let title = req.body["title"];
    let post = req.body["post"];

    titles.push(title);
    posts.push(post);

    res.redirect("/notes");
});

app.post("/update/:postId", (req, res) => {
    const postId = req.params.postId;
    const updatedPost = req.body.updatedPost;
    const updatedTitle = req.body.updatedTitle;

    posts[postId] = updatedPost;
    titles[postId] = updatedTitle;

    res.redirect("/notes");
});

app.post("/delete/:postId", (req, res) => {
    const postId = req.params.postId;

    titles.splice(postId, 1);
    posts.splice(postId, 1);

    res.redirect("/notes");
});


app.listen(port, () =>{
    console.log(`Server running on port ${port}.`);
})