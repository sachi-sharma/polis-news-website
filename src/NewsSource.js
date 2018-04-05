import React, {Component} from 'react'

class NewsSource extends Component {
    render() {
        return (
        	<div>
            	<a href={this.props.url}>{this.props.children}</a>
           	</div>
        )
    }
}

export default NewsSource