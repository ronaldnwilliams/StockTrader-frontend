import React, { Component } from 'react';
import News from './News';
import StockList from './StockList';
import InputBar from './InputBar';
import Chart from './Chart';
import { currencyFormat } from '../AppMethods'


function QuoteData(props) {
  if (props.quoteData !== null) {
    const bid = props.quoteData.iexBidPrice;
    const ask = props.quoteData.iexAskPrice;
      return (
        <div>
          <li className='list-group-item text-dark'>Symbol: { props.quoteData.symbol } </li>
          <li className='list-group-item text-dark'>Last Trade: { currencyFormat(props.quoteData.latestPrice) }</li>
          <li className='list-group-item text-dark'>
          Bid / Ask: { isNaN(Number(bid)) ? 'N/A' : currencyFormat(bid) }
           / { isNaN(Number(ask)) ? 'N/A' : currencyFormat(ask) }
          </li>
          <li className='list-group-item text-dark'>
          Day - High / Low: { currencyFormat(props.quoteData.high) }
           / { currencyFormat(props.quoteData.low) }
          </li>
          <li className='list-group-item text-dark'>Volume: { props.quoteData.avgTotalVolume }</li>
          <li className='list-group-item text-dark'>
            52 Week - High / Low:
            { currencyFormat(props.quoteData.week52High) }
             / { currencyFormat(props.quoteData.week52Low) }
           </li>
        </div>
      );
  } else {
      return (
        <div>
          <li className='list-group-item text-dark'>Symbol:</li>
          <li className='list-group-item text-dark'>Last Trade:</li>
          <li className='list-group-item text-dark'>Bid / Ask:</li>
          <li className='list-group-item text-dark'>Day - High / Low:</li>
          <li className='list-group-item text-dark'>Volume:</li>
          <li className='list-group-item text-dark'>52 Week - High / Low:</li>
        </div>
      );
  }
}

function QuoteForm(props) {
    return (
      <ul className='list-group'>
        <li className='list-group-item text-dark'>
          <h3>Quote</h3>
        </li>
        <QuoteData quoteData={ props.quoteData }/>
        <li className='list-group-item text-dark'>
          <InputBar
            placeholder="Quantity"
            buttonValue="Buy"
            handleSubmit={ props.handleBuyBar }
          />
        </li>
      </ul>
    );
}

class Quote extends Component {
  constructor(props) {
      super(props);
      this.state = {
        error: null,
        currentSymbol: '',
        quoteRange: '1d',
        quoteData: null,
        news: null,
        chartData: null
      };
      this.handleErrorClear = this.handleErrorClear.bind(this);
    }

    handleBuyBar = (quantity) => {
        this.props.handleBuyStock(this.state.currentSymbol, quantity);
    }

    handleRangeChange = (e, range) => {
        e.preventDefault();
        this.handleQuote(range);
    }

    handleQuote = (range = this.state.quoteRange) => {
      const symbol = this.props.quoteSymbol;
      const url = 'https://api.iextrading.com/1.0/stock/' +
          symbol + '/batch?types=quote,news,chart&range=' + range;
      fetch(url)
          .then((res) => res.json())
          .then((result) => {
            this.setState({
                currentSymbol: symbol,
                quoteRange: range,
                quoteData: result.quote,
                news: result.news,
                chartData: result.chart
            });
          },
          (error) => {
          error.message = `Could not find quote for ${symbol}`
          this.setState({
            error,
            currentSymbol: this.props.quoteSymbol
          });
        })
    }

    handleErrorClear() {
      this.setState({
        error: null,
      });
    }

    handleSymbolChange() {
      this.handleQuote();
    }

    render() {
      if (this.state.currentSymbol !== this.props.quoteSymbol) {
        this.handleSymbolChange();
      }
      const quoteError = this.state.error;
      const message = quoteError
        ? <div className="alert alert-danger">Error: {quoteError.message}
            <button className='btn btn-light' onClick={this.handleErrorClear}>Close</button>
          </div>
        : '';
      return (
        <div>
          <div>
            {message}
          </div>
          <div className='row'>
            <div className='col-lg-8'>
              <div className='row'>
                <Chart
                  chartData={ this.state.chartData }
                  balanceRange={ this.state.quoteRange }
                  handleRangeChange={ this.handleRangeChange }
                />
              </div>
              <div className='row'>
                <div className='col'>
                  <QuoteForm
                    handleQuote={ this.handleQuote }
                    quoteData={ this.state.quoteData }
                    handleBuyBar={ this.handleBuyBar }
                  />
                </div>
                <div className='col'>
                  <News news={ this.state.news } />
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              <StockList
                cash ={ this.props.cash }
                stocks={ this.props.stocks }
                handleSellStock={ this.props.handleSellStock }
                watchStocks={ this.props.watchStocks }
                handleAddWatchStock={ this.props.handleAddWatchStock }
                handleRemoveWatchStock={ this.props.handleRemoveWatchStock }
                handleQuote={ this.props.handleQuote }
              />
            </div>
          </div>
        </div>
      );
    }
}

export default Quote;
