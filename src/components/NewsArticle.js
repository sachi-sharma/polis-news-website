import React, {Component} from 'react'

class NewsArticle extends Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default NewsArticle