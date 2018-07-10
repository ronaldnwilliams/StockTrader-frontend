import React, { Component } from 'react';


function Article(props) {
  return (
    <li className='list-group-item text-dark'>
      <a href={props.article.url} target="_blank">
        <p>{props.article.headline}</p>
        <p>{props.article.datetime}</p>
        <p>{props.article.source}</p>
      </a>
    </li>
  );
}

class News extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    const moreLessButton =
    <li className='list-group-item'>
      <button
        className='btn btn-info btn-block'
        onClick={this.toggle}>
        { this.state.collapse ? 'Show Less' : 'Show More'}
      </button>
    </li>;
    return (
      <ul className='list-group'>
        <li className='list-group-item text-dark'><h3>News</h3></li>
        { this.props.news !== null
          ? this.props.news.map((newsItem, index, arr) => {
            if (this.state.collapse) {
              return <Article key={index} article={newsItem}/>;
            } else {
                return (index < 2) ? <Article key={index} article={newsItem}/> : '';
            }
          })
          : <li className='list-group-item text-dark'>No news at this time.</li>}
          { this.props.news !== null && this.props.news.length > 2
            ? moreLessButton
            : ''}
      </ul>
    );
  }
}

export default News;
