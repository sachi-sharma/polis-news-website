import React, { Component } from 'react';
import NewsSource from './NewsSource'
import NewsArticle from './NewsArticle'
import ToggleDisplay from 'react-toggle-display';
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const adapter = new LocalStorage('db')
const db = low(adapter)
db.defaults({ articles: [] }).write()

class NewsApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sources: [],
            articles: [],
            showArticles: false,
            showSavedArticles: false
        };
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
        if(this.props.count) {
            fetch("https://newsapi.org/v2/sources?apiKey=ee8f84afffa34390a6edc70ac6025856")
                .then(response => response.json())
                .then(json =>   json.sources.slice(0, this.numOfSources)
                                    .forEach(source => self.loadSources(source)));
        }
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
            <NewsSource key={i} id={source.id}
                url={source.url} action={this.handleClick}>
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
                    titile: article.title,
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
                <NewsArticle key={"art"+i} id={article.id}
                    url={article.url} action={this.saveArticle}>
                    {article.description}
                </NewsArticle>
                <ToggleDisplay key={"save"+i} show={!this.state.showSavedArticles}>
                    <button onClick={() => this.saveArticle(article.description, article.titile)}> Save</button>
                </ToggleDisplay>
                <ToggleDisplay key={"del"+i} show={this.state.showSavedArticles}>
                    <button onClick={() => this.deleteArticle(article.title)}> Delete</button>
                </ToggleDisplay>
            </div>
        );
    }

    handleClick(id, showSavedArticles) {
        if(!showSavedArticles) {
            var self = this;
            fetch("https://newsapi.org/v2/top-headlines?sources="+id+"&apiKey=ee8f84afffa34390a6edc70ac6025856")
                            .then(response => response.json())
                            .then(json =>   json.articles.sort(
                                                             function(a, b) {
                                                                return Date.parse(a.publishedAt) < Date.parse(b.publishedAt) ? 1 : -1;
                                                             }).slice(0,this.numOfArticles)
                                                          .forEach(article => self.loadArticles(article)));
            self.setState({
                  showArticles: true,
                  articles:[],
                  showSavedArticles: false
            });
        }
        else{
            this.setState({
                  showArticles: true,
                  articles: db.get('articles').value(),
                  showSavedArticles: true
            });
        }
    }

    saveArticle(description, title) {
      db.get('articles')
        .push({ description: description, title: title})
        .write()
        console.log(db.get('articles').value());
    }

    deleteArticle(title) {
        db.get('articles')
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
           <div>
               <div className="sources col-xs-12">
                    {this.state.sources.map(this.eachSource)}
               </div>
               <div>-------------</div>
               <div>
                <a onClick={() => this.handleClick('',true)}>Click to view saved articles</a>
               </div>
               <ToggleDisplay show={this.state.showArticles}>
                   <div className="articles col-xs-12">
                        {this.state.articles.map(this.eachArticle)}
                   </div>
               </ToggleDisplay>
           </div>
        );
    }
}

export default NewsApp;
