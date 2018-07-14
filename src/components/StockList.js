import React, { Component } from 'react';
import ActionButton from './ActionButton';
import InputBar from './InputBar';
import { currencyFormat, percentFormat } from '../AppMethods'
import 'bootstrap/dist/css/bootstrap.min.css';


class StockListRow extends Component {
  renderActionButton(stockID, onClick, action) {
    return (
      <ActionButton
        handleClick={onClick}
        stockID={stockID}
        action={action}
      />
    );
  }

  handleClick = (e, symbol) => {
    e.preventDefault();
    this.props.handleQuote(symbol)
  }

  render() {
    const listStock = this.props.stock;
    return (
      <li className='list-group-item d-flex justify-content-between align-items-center border-dark'>
          <button
            className='btn btn-link'
            onClick={e => this.handleClick(e, listStock.symbol)}>
            { listStock.symbol }
          </button>
          <span className='text-dark'>
            { currencyFormat(listStock.quote.latestPrice) }
          </span>
          <span className={Number(listStock.quote.change) >= 0 ? 'text-success' : 'text-danger' }>
            { this.props.dollar
              ? currencyFormat(listStock.quote.change)
              : percentFormat(listStock.quote.changePercent) }
          </span>
          { this.renderActionButton(
              listStock.id,
              this.props.handleSellStock,
              this.props.action) }
      </li>
    );
  }
}

class StockList extends Component {
  render() {
      var dollar = true;
      return (
        <div>
          <li className='list-group-item bg-dark'>
            <InputBar
              placeholder="Search"
              buttonValue="Search"
              handleSubmit={ this.props.handleQuote }
            />
          </li>
          <li className='list-group-item bg-light border-dark rounded '>
            <strong className='text-dark ml-3'>Cash: </strong>
            <span className='text-success ml-3'>{currencyFormat(this.props.cash)}</span>
          </li>
          <ul className='list-group'>
              { this.props.stocks.map((stock) => {
                return (
                  <StockListRow
                    key={stock.id}
                    stock={stock}
                    dollar={dollar}
                    handleQuote={this.props.handleQuote}
                    handleSellStock={this.props.handleSellStock}
                    action='Sell'
                  />
                )
              }) }
          </ul>
          <ul className='list-group'>
              <li className='list-group-item bg-dark'>
                <h4>Watch List</h4>
                <InputBar
                  placeholder="Symbol"
                  buttonValue="Add"
                  handleSubmit={ this.props.handleAddWatchStock }
                />
              </li>
              { this.props.watchStocks.map((watchStock) => {
                return (
                  <StockListRow
                    key={watchStock.id}
                    stock={watchStock}
                    dollar={dollar}
                    handleQuote={this.props.handleQuote}
                    handleSellStock={this.props.handleRemoveWatchStock}
                    action='Remove'
                  />
                )
              }) }
          </ul>
        </div>
      );
  }
}

export default StockList;
