import React, { Component } from 'react';
import Chart from './Chart';
import StockList from './StockList';
import ActionButton from './ActionButton';
import { currencyFormat } from '../AppMethods'


class StockRow extends Component {
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
    this.props.handleQuotePage(symbol);
  }

  render() {
      const stock = this.props.stock;
      const stockMarketValue = Number(stock.quote.latestPrice) * Number(stock.quantity);
      const stockCostBasis = Number(stock.purchase_price) * Number(stock.quantity);
      const gainLoss = stockMarketValue - stockCostBasis;
      return (
        <tr className='table-light text-dark' key={ stock.id }>
          <td onClick={e => this.handleClick(e, stock.symbol)}>
            <button
              className='btn btn-link'>
              <span>
                { stock.symbol }
              </span>
            </button>
          </td>
          <td>{ stock.quantity }</td>
          <td>{ currencyFormat(stock.quote.latestPrice) }</td>
          <td>
            <button className='btn btn-link'>
              { currencyFormat(stock.purchase_price) }
            </button>
          </td>
          <td>{ currencyFormat(stockMarketValue) }</td>
          <td>
            <button className='btn btn-link'>
              { currencyFormat(stockCostBasis) }
            </button>
          </td>
          <td className={ gainLoss >= 0 ? 'text-green' : 'text-danger' }>{ currencyFormat(gainLoss) }</td>
        </tr>
      );
  }
}

class StockTable extends Component {
    render() {
        const rows = [];
        this.props.stocks.forEach((stock) => {
            rows.push(
              <StockRow
                key={ stock.id }
                stock={ stock }
                handleSellStock={ this.props.handleSellStock }
                handleQuotePage={ this.props.handleQuotePage }
              />
            );
        });
        return (
          <div className='table-responsive'>
            <table className='table '>
              <thead className='thead-light'>
                <tr className=''>
                  <th>Symbol</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Cost / share</th>
                  <th>Market Value</th>
                  <th>Cost Basis</th>
                  <th>Gain / Loss</th>
                </tr>
              </thead>
              <tbody >
                { rows }
              </tbody>
            </table>
          </div>
        );
    }
}

class BalanceTable extends Component {
    render() {
        return (
          <div className='table-responsive'>
            <table className='table'>
              <thead className='thead-light'>
                <tr className=''>
                  <th>Cash</th>
                  <th>Market value</th>
                  <th>Total balance</th>
                </tr>
              </thead>
              <tbody>
                <tr className='table-light text-dark'>
                  <td>{ currencyFormat(this.props.cash) }</td>
                  <td>{ currencyFormat(this.props.marketValue) }</td>
                  <td>{ currencyFormat(this.props.totalBalance) }</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
    }
}

class Account extends Component {

  handleBalanceRangeChange = (e, range) => {
      e.preventDefault();
      this.props.handleBalanceRange(range);
  }

  handleQuotePage = (symbol) => {
    this.props.handleQuotePage(symbol);
  }

  render() {
    var marketValue = 0;
    this.props.stocks.forEach((stock) => {
        if (typeof(stock['quote']) !== 'undefined') {
            marketValue += stock['quote']['latestPrice'] * stock.quantity;
        }
    });
    const totalBalance = Number(this.props.cash) + marketValue;
    const todayLabel = new Date().toDateString()
    var chartData = [];
    if (this.props.balanceRange === '1d') {
      this.props.balanceChartData.forEach((data, index, arr) => {
        chartData.push({close: data.balance, label: data.time })
      });
    } else {
      // 1m = 24, 3m = 65, 6m = 126, 1y = 253, 5y = 1259
      var dailyBalBeforeSignup;
      switch(this.props.balanceRange) {
        case '1m':
          dailyBalBeforeSignup = 24;
          break;
        case '3m':
          dailyBalBeforeSignup = 65;
          break;
        case '6m':
          dailyBalBeforeSignup = 126;
          break;
        case '1y':
          dailyBalBeforeSignup = 253;
          break;
        case '5y':
          dailyBalBeforeSignup = 1259;
          break;
        default:
          dailyBalBeforeSignup = 24;
          break;
      }
      dailyBalBeforeSignup -= this.props.dailyBalance.length;
      var today = Date.now();
      var oneDayMilli = 60000 * 1440;
      for (let i = 0; chartData.length < dailyBalBeforeSignup; i++) {
        let theDay = new Date(today - (oneDayMilli * (i+1)));
        if (theDay.getDay() !== 0 && theDay.getDay() !== 6) {
          chartData.push({close: 100000.00, label: theDay.toDateString() });
        }
      }
      this.props.dailyBalance.forEach((bal) => {
        chartData.push({close: bal.balance, label: bal.date })
      });
      chartData.push({close: totalBalance, label: todayLabel});
      chartData.sort(function(a, b) {
        return new Date(a.label) - new Date(b.label);
      });
    }
    return (
      <div className='row'>
        <div className='col-lg-8'>
          <div className=''>
            <Chart
              chartData={chartData}
              balanceRange={ this.props.balanceRange }
              handleRangeChange={ this.handleBalanceRangeChange }
            />
          </div>
          <div className=''>
            <BalanceTable
              cash={ this.props.cash }
              stocks={ this.props.stocks }
              marketValue={ marketValue }
              totalBalance={ totalBalance }
            />
          </div>
          <div className=''>
            <StockTable
              stocks={ this.props.stocks }
              handleSellStock={ this.props.handleSellStock }
              handleQuotePage={ this.handleQuotePage }
            />
          </div>
        </div>
        <div className='col-lg-4'>
          <StockList
            cash={ this.props.cash }
            stocks={ this.props.stocks }
            handleSellStock={ this.props.handleSellStock }
            watchStocks={ this.props.watchStocks }
            handleAddWatchStock={ this.props.handleAddWatchStock }
            handleRemoveWatchStock={ this.props.handleRemoveWatchStock }
            handleQuote={ this.props.handleQuotePage }
          />
        </div>
      </div>
    );
  }
}

export default Account;
