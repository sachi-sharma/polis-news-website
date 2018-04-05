import React, { Component } from 'react';
import NewsSource from './NewsSource'

class NewsApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sources: []
        }
        this.eachSource = this.eachSource.bind(this)
        this.addSource = this.addSource.bind(this)
    }

    componentWillMount() {
        var self = this
        if(this.props.count) {
            fetch(`https://newsapi.org/v2/sources?apiKey=ee8f84afffa34390a6edc70ac6025856`)
                .then(response => response.json())
                .then(json =>   json.sources
                                    .forEach(source => self.addSource(source)))
        }
    }

    addSource(source) {
        this.setState(prevState => ({
            sources: [
                ...prevState.sources,
                {
                    id: source.id,
                    source: source.name,
                    url: source.url
                }
            ]
        }))
    }

    eachSource(source, i) {
        return (
            <NewsSource key={i}
                url={source.url}>
                {source.source}
            </NewsSource>
        )
    }

    render() {
        return (
          <div className="sources">
              {this.state.sources.map(this.eachSource)}
          </div>
        );
    }
}

export default NewsApp;
