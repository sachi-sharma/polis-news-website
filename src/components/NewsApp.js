import React, { Component } from 'react';
import NewsSource from './NewsSource';
import NewsArticle from './NewsArticle';
import ToggleDisplay from 'react-toggle-display';
import low from 'lowdb';
import FaPlus from 'react-icons/lib/fa/plus';
import FaTrash from 'react-icons/lib/fa/trash';
import LocalStorage from 'lowdb/adapters/LocalStorage';
const apikey = require('./../data/newsapikey.json');

class NewsApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sources: [],
            articles: [],
            showArticles: false,
            showSavedArticles: false
        };
        var adapter = new LocalStorage('db')
        this.db = low(adapter)

        this.username = this.props.match.params.name
        this.numOfSources = 5;
        this.numOfArticles = 10;
        this.loadSources = this.loadSources.bind(this);
        this.eachSource = this.eachSource.bind(this);
        this.loadArticles = this.loadArticles.bind(this);
        this.eachArticle = this.eachArticle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.saveArticle = this.saveArticle.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
    }

    componentWillMount() {
        var self = this;
        fetch("https://newsapi.org/v2/sources?apiKey="+apikey.apikey)
                        .then(response => response.json())
                        .then(json =>   json.sources.slice(0, this.numOfSources)
                                            .forEach(source => self.loadSources(source)));
    }

    loadSources(source) {
        this.setState(prevState => ({
            sources: [
                ...prevState.sources,
                {
                    id: source.id,
                    source: source.name,
                    url: source.url
                }
            ]
        }));
    }

    eachSource(source, i) {
        return (
            <NewsSource key={i} id={source.id} url={source.url} action={this.handleClick}>
                {source.source}
            </NewsSource>
        );
    }

    loadArticles(article) {
        this.setState(prevState => ({
            articles: [
                ...prevState.articles,
                {
                    author: article.author,
                    url: article.url,
                    title: article.title,
                    description: article.description,
                    source: article.source,
                    publishedAt:  new Date(article.publishedAt).toString()
                }
            ]
        }));
    }

    eachArticle(article, i) {
        return (
            <div key={"div"+i} >
                <NewsArticle key={"art"+i} id={article.id} url={article.url}>
                    <h2><a href={article.url} target="_blank">{article.title}</a></h2>
                    {article.description}
                    <br></br>
                    <a href={article.url} target="_blank">Read More</a>
                    <br></br>
                    <ToggleDisplay key={"save"+i} show={!this.state.showSavedArticles}>

					    <button onClick={() => this.saveArticle(article.description, article.title, article.url)}><FaPlus /></button>
                    </ToggleDisplay>
                    <ToggleDisplay key={"del"+i} show={this.state.showSavedArticles}>
					    <button onClick={() => this.deleteArticle(article.title)}><FaTrash /></button>
                    </ToggleDisplay>
                </NewsArticle>
            </div>
        );
    }

    handleClick(id, showSavedArticles, name) {
        if(!showSavedArticles) {
            var self = this;
            fetch("https://newsapi.org/v2/top-headlines?sources="+id+"&apiKey="+apikey.apikey)
                            .then(response => response.json())
                            .then(json =>   json.articles.sort(
                                                             function(a, b) {
                                                                return Date.parse(a.publishedAt) < Date.parse(b.publishedAt) ? 1 : -1;
                                                             }).slice(0,this.numOfArticles)
                                                          .forEach(article => self.loadArticles(article)));
            self.setState({
                  showArticles: true,
                  articles:[],
                  showSavedArticles: false,
                  source: name
            });
        }
        else{
            this.setState({
                  showArticles: true,
                  articles: this.db.get('users')
                                    .find({ "username": this.username }).get('savedArticles').value(),
                  showSavedArticles: true
            });
        }
    }

    saveArticle(description, title, url) {
      console.log(this.db.value())
      this.db.get('users')
        .find({ "username": this.username })
        .get("savedArticles")
        .push({ "description": description, "title": title, "url":url})
        .write()

      console.log(this.db.value())
    }

    deleteArticle(title) {
      this.db.get('users')
          .find({ "username": this.username })
          .get("savedArticles")
          .remove({ title: title })
          .write()

      var array = this.state.articles;
      var index = -1;
      for (var i = 0; i < array.length; i++)
        if(array[i].title === title) {
            array.splice(index, 1);
            break;
        }
      this.setState({articles: array });
    }

    render() {
        return (
           <div className="wrapper">
               <div className="sources col-xs-12">
                    {this.state.sources.map(this.eachSource)}
               <br></br>
               <a onClick={() => this.handleClick('',true)}>Click to view saved articles</a>
               </div>

               <ToggleDisplay show={this.state.showArticles}>
                   <div className="articles col-xs-12">
                       <ToggleDisplay show={this.state.showSavedArticles}>
                            <h3>Saved Articles</h3>
                       </ToggleDisplay>

                       <ToggleDisplay show={!this.state.showSavedArticles}>
                            <h3>Articles from {this.state.source}</h3>
                       </ToggleDisplay>
                        {this.state.articles?this.state.articles.map(this.eachArticle):""}
                   </div>
               </ToggleDisplay>
           </div>
        );
    }
}

export default NewsApp;
