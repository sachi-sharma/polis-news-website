import React, {Component} from 'react'

class NewsArticle extends Component {
    render() {
        return (
            <div className="article">
                {this.props.children}
            </div>
        );
    }
}

export default NewsArticle