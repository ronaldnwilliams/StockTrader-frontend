import React, { Component } from 'react';
import { currencyFormat, percentFormat } from '../AppMethods';


class IndicesBar extends Component {
  constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        indices: []
      };
  }

  componentDidMount() {
    fetch("https://api.iextrading.com/1.0/stock/market/batch?symbols=DIA,SPY,IWM&types=quote,chart&range=1d")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            indices: Object.values(result)
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, indices } = this.state;
    if (error) {
      return <div className='row'>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div className='row'>Loading...</div>;
    } else {
      return (
        <div className='row w-100 mx-auto mb-2 p-2 bg-dark border border-white rounded'>
          {indices.map(index => (
            <div className='col-lg text-center p-1' key={index.label}>
              <span className='mx-1'>
                {index.quote.symbol}
              </span>
              <span className='mx-1'>
                {currencyFormat(index.quote.latestPrice)}
              </span>
              <span className={Number(index.quote.changePercent) > 0 ? 'text-success' : 'text-danger'}>
                {percentFormat(index.quote.changePercent)}
              </span>
            </div>
          ))}
        </div>
      );
    }
  }
}

export default IndicesBar;
