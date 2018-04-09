import React, {Component} from 'react'

class NewsSource extends Component {
    render() {
        return (
            <div className="source" onClick={() => this.props.action(this.props.id, false)}>
                <a>{this.props.children}</a>
            </div>
        );
    }
}

export default NewsSource