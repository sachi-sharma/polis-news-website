import React, {Component} from 'react'

class NewsSource extends Component {
    render() {
        return (
            <div onClick={() => this.props.action(this.props.id, false)}>
                <a>{this.props.children}</a>
            </div>
        );
    }
}

export default NewsSource