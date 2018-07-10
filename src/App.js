import React, { Component } from 'react';
import cat from './images/cat.jpg';
import SiteNav from './components/SiteNav';
import Login from './components/Login';
import Signup from './components/Signup';
import Account from './components/Account';
import Quote from './components/Quote';
import './App.css';


class StockSite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: localStorage.getItem('token') ? true : false,
            isLoaded: false,
            accountPage: true,
            signupPage: false,
            balanceRange: '1d',
            balanceChartData: null,
            quoteSymbol: '',
            user: null,
            error: null
        };
    }

    componentDidMount() {
        this.getData();
    }

    // TODO: add indicies https://api.iextrading.com/1.0/stock/DIA/app-global-data
    // TODO: add live updates maybe make a switch; every second; dont hit database
    // TODO: add top gainers / losers
    // TODO: add top users / user trades
    getData = (data = 0, method = 0, range = this.state.balanceRange) => {
        if (this.state.loggedIn) {
            const initObject = this.getInitObject(data, method);
            // https://stock-site-rnw.herokuapp.com/
            const backendURL = 'https://stock-site-rnw.herokuapp.com/current_user/';
            fetch(backendURL, initObject)
              .then((res) => {
                if (initObject.method && res.status === 400) {
                  var error = {message: `Unable to make purchase. Please make
                    sure enough funds are available or a number was entered for
                    quantity.`};
                  this.setState({ error: error });
                }
                return res.json();
              })
              .then((result) => {
                  const user = result.user_account;
                  const stocks = user.portfolio.stocks;
                  var balanceChartData = this.setBalanceChartData();
                  const watchStocks = user.portfolio.watch_stocks;
                  const stockUrl = this.getStocksString(stocks);
                  const watchStockUrl = this.getStocksString(watchStocks);
                  const iexUrl = 'https://api.iextrading.com/1.0/stock/market/';
                  const quoteUrl = iexUrl +'batch?symbols=' + stockUrl + ',' +
                    watchStockUrl + '&types=quote';
                  const chartUrl = iexUrl +'batch?symbols=' + stockUrl +
                    '&types=chart&range=' + range;
                  // Get Chart data for each stock based on selected balance range
                  var chartDataAPI =
                  fetch(chartUrl)
                    .then(res => res.json())
                    .then((chartResult) => {
                        this.addChartsToStocks(stocks, chartResult, range);
                    });
                    // Get quote data for each stock
                    var quoteDataAPI = fetch(quoteUrl)
                      .then(res => res.json())
                      .then((quoteResult) => {
                          stocks.forEach((stock) => {
                              stock['quote'] = quoteResult[stock.symbol]['quote'];
                          });
                          watchStocks.forEach((watchStock) => {
                            watchStock['quote'] =
                              quoteResult[watchStock.symbol]['quote'];
                          });
                      });
                      Promise.all([chartDataAPI, quoteDataAPI]).then(() => {
                        stocks.forEach((stock) => {
                          for (var i=0; i<balanceChartData.length; i++) {
                            if (i < stock.chart.length) {
                              if (balanceChartData[i]['time'] === stock.chart[i]['minute']) {
                                // go through chart data and try to find a
                                // number that is not 0 or undefined else use
                                // quoted previous close
                                var stockPrice =
                                  stock.chart[i].close ?
                                    Number(stock.chart[i].close) !== 0 ? Number(stock.chart[i].close) :
                                      Number(stock.chart[i].marketClose) !== 0 ? Number(stock.chart[i].marketClose) :
                                      Number(stock.chart[i].marketAverage) !== 0 ? Number(stock.chart[i].marketAverage) :
                                      'n/a' :
                                    'n/a';
                                if (isNaN(stockPrice) || stockPrice === 'n/a' || stockPrice === 0) {
                                  stockPrice = stock.quote['previousClose'];
                                }
                                balanceChartData[i]['balance'] +=
                                  Number(stock.quantity) * stockPrice;
                              }
                            } else {
                              balanceChartData[i]['balance'] +=
                                Number(stock.quantity) * Number(stock.quote['latestPrice']);
                            }
                          }

                        });
                        balanceChartData.forEach((data) => {
                          data['balance'] += Number(user.portfolio.cash);
                        });
                        this.setState((prevState) => {
                            return {
                                user: user,
                                isLoaded: true,
                                balanceRange: range,
                                balanceChartData: balanceChartData
                            }
                        });
                      });
                });
        }
    }

    getInitObject(data, method) {
      if (method === 'POST') {
          return {
              method: 'POST',
              headers: {
                  Authorization: `JWT ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data),
          };
          // DELETE method to sell stock and return account data
      } else if (method === 'DELETE') {
          return {
              method: 'DELETE',
              headers: {
                  Authorization: `JWT ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data),
          };
      } else {
        return {
          headers: {
              Authorization: `JWT ${localStorage.getItem('token')}`
          }
        };
      }
    }

    getStocksString(stocks) {
        let stocksStr = '';
        stocks.forEach((stock, index) => {
            if (index < stocks.length - 1) {
                stocksStr += stock.symbol + ',';
            } else {
                stocksStr += stock.symbol;
            }
        });
        return stocksStr;
    }

    // loop through each stock and add chart data. if stock
    // was purchased today and balance range is 1d then
    // slice only the time for when this stock was purchased
    addChartsToStocks(stocks, chartResult, range) {
      let today = new Date().toDateString();
      stocks.forEach((stock) => {
          let stockDate = new Date(stock.purchase_date);
          let stockChart = chartResult[stock.symbol]['chart'];
          // if 1d and bought today
          if (range === '1d' && stockDate.toDateString() === today) {
              // get the stock purchase time, loop through the times of the
              // chart data from api and slice matching times when owned
              let stockTime = stockDate;
              let hour = stockTime.getUTCHours() - 4;
              if (hour < 10) {
                  hour = '0' + hour.toString();
              }
              let minutes = stockTime.getUTCMinutes();
              let time = (hour + ':' + (minutes < 10 ? '0' + minutes : minutes));
              stockChart = stockChart.slice(
                  stockChart.findIndex(
                    (x) => {
                      return x['minute'] === time
                    }
                  ), stockChart.length - 1
              );
              stock['chart'] = stockChart;
          } else {
              stock['chart'] = stockChart;
          }
      });
    }

    setBalanceChartData() {
      var balanceChartData = [];
      var x = new Date();
      var y = x.getUTCHours() - 4 + ':' +
      (x.getUTCMinutes() < 10
        ? "0" + x.getUTCMinutes()
        : x.getUTCMinutes());
      var opening30minutes = true;
      var upToCurrentTime = false;
      for(var i=9; i<16; i++) {
      	if (upToCurrentTime) {
          	break;
      	} else {
              var j = opening30minutes ? 30 : 0;
              for(j; j<60; j++) {
                  var time = (i < 10 ? "0" + i : i) + ":" + (j < 10 ? "0" + j : j);
                  if (time === y && x.getDay() !== 0 && x.getDay() !== 6) {
                      balanceChartData.push({time:time, balance:0.00});
  				            upToCurrentTime = true;
                      break;
                  } else {
    				          balanceChartData.push({time:time, balance:0.00});
                      if (j===59) {
                          opening30minutes = false;
                      }
                  }
              }
          }
      }
      return balanceChartData
    }

    handleBuyStock = (symbol, quantity) => {
      var error;
      if (Number.isInteger(Number(quantity))) {
        if (Number(quantity) > 0) {
          const data = {
              watchStock: false,
              symbol: symbol,
              quantity: quantity
          };
          const method = 'POST';
          this.getData(data, method);
        } else {
          error = {message: `${quantity} was entered for quantity. Number
          must be positive. Short selling is currently not available`};
          this.setState({ error: error });
        }
      } else {
        error = {message: `${quantity} is not a number.`};
        this.setState({ error: error });
      }
    }

    handleSellStock = (e, stockID) => {
      e.preventDefault();
      const data = {
        watchStock: false,
        stockID: stockID
      };
      const method = 'DELETE';
      this.getData(data, method);
    }

    handleAddWatchStock = (symbol) => {
      var error;
      var alreadyOwn = false;
      var onList = false;
      this.state.user.portfolio.stocks.forEach((stock) => {
        if (stock.symbol === symbol.toUpperCase()) {
          onList = true;
          alreadyOwn = true;
        }
      });
      this.state.user.portfolio.watch_stocks.forEach((stock) => {
        if (stock.symbol === symbol.toUpperCase()) {
          onList = true;
        }
      })
      if (!onList && !alreadyOwn) {
        const url = `https://api.iextrading.com/1.0/stock/${symbol}/quote`;
        fetch(url)
            .then((res) => {
              if (res.status !== 404) {
                const data = {
                    watchStock: true,
                    symbol: symbol,
                };
                const method = 'POST';
                this.getData(data, method);
              } else {
                var error = {message: `Could not find symbol: ${symbol}.`};
                this.setState({ error: error });
              }
            });
      } else if (onList && !alreadyOwn) {
        error = {message: `${symbol} is already on your watch list.`};
        this.setState({ error: error });
      } else {
        error = {message: `You own ${symbol}. It is already on your
        stock list.`};
        this.setState({ error: error });
      }

    }

    handleRemoveWatchStock = (e, watchStockID) => {
        e.preventDefault();
        const data = {
            watchStock: true,
            stockID: watchStockID
        };
        const method = 'DELETE';
        this.getData(data, method);
    }

    handleBalanceRange = (range) => {
      this.getData(0, 0, range);
    }

    handleLogin = (e, data) => {
        e.preventDefault();
        // https://stock-site-rnw.herokuapp.com/token-auth/
        fetch('https://stock-site-rnw.herokuapp.com/token-auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then((result) => {
                localStorage.setItem('token', result.token);
                this.setState({
                    loggedIn: true,
                    accountPage: true,
                    isLoaded: false
                });
                this.getData();
            });
    }

    handleSignup = (e, data) => {
        e.preventDefault();
        var error;
        if (data['password'] !== data['rePassword']) {
          error = {message: `Passwords do not match.`};
          this.setState({ error: error });
        } else if (data['username'].length < 4) {
          error = {message: `Username must be at least four characters long.`};
          this.setState({ error: error });
        } else if (data['password'].length < 6) {
          error = {message: `Password must be at least six characters long.`};
          this.setState({ error: error });
        } else {
          // https://stock-site-rnw.herokuapp.com/users/
          fetch('https://stock-site-rnw.herokuapp.com/users/', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
              })
              .then(res => res.json())
              .then((result) => {
                  localStorage.setItem('token', result.token);
                  this.setState({
                      loggedIn: true,
                      accountPage: true,
                      isLoaded: false
                  });
                  this.getData();
              });
        }
    }

    handleLogout = () => {
        localStorage.removeItem('token');
        this.setState({
            loggedIn: false,
            isLoaded: false,
            balanceRange: '1d',
            balanceChartData: null,
            quoteSymbol: '',
            user: null,
            error: null,
            signupPage: false
        });
    }

    handleSignupPage = () => {
        this.setState(prevstate => ({
            signupPage: !prevstate.signupPage
        }));
    }

    handleQuotePage = (symbol) => {
      this.handleQuoteSymbol(symbol);
      if (this.state.accountPage) {
        this.handleAccountPage();
      }
    }

    handleAccountPage = () => {
      this.setState(prevstate => ({
          accountPage: !prevstate.accountPage
      }));
    }

    handleQuoteSymbol = (symbol) => {
      this.setState({ quoteSymbol: symbol });
    }

    handleAppErrorClear = () => {
      this.setState({ error: null });
    }

    render() {
        document.body.style.background = '#6441A5';
        document.body.style.color = 'white';
        const error = this.state.error;
        const message = error
          ? <div class="alert alert-warning">Error: {error.message}
              <button className='btn btn-light' onClick={this.handleAppErrorClear}>Close</button>
            </div>
          : '';
        var screen;
        if (this.state.loggedIn) {
            if (this.state.isLoaded) {
                const joined = this.state.user.joined;
                const stocks = this.state.user.portfolio.stocks;
                const cash = this.state.user.portfolio.cash;
                const watchStocks = this.state.user.portfolio.watch_stocks;
                const dailyBalance = this.state.user.portfolio.daily_balance;
                const balanceChartData = this.state.balanceChartData;
                const balanceRange = this.state.balanceRange;
                const quoteSymbol = this.state.quoteSymbol;
                if (this.state.accountPage) {
                    screen =
                    <div>
                      <Account
                        joined={ joined }
                        cash={ cash }
                        stocks={ stocks }
                        dailyBalance={ dailyBalance }
                        balanceChartData={ balanceChartData }
                        handleQuotePage={ this.handleQuotePage }
                        handleBalanceRange={ this.handleBalanceRange }
                        balanceRange={ balanceRange }
                        handleSellStock={ this.handleSellStock }
                        watchStocks={ watchStocks }
                        handleAddWatchStock={ this.handleAddWatchStock }
                        handleRemoveWatchStock={ this.handleRemoveWatchStock }
                      />
                    </div>;
                } else if (quoteSymbol.length > 0) {
                    screen =
                    <div>
                      <Quote
                        quoteSymbol={ quoteSymbol }
                        cash={ cash }
                        stocks={ stocks }
                        handleBuyStock={ this.handleBuyStock }
                        handleSellStock={ this.handleSellStock }
                        watchStocks={ watchStocks }
                        handleAddWatchStock={ this.handleAddWatchStock }
                        handleRemoveWatchStock={ this.handleRemoveWatchStock }
                        handleQuote={ this.handleQuotePage }
                      />
                    </div>;
                }
            } else {
                screen =
                <div className='text-white'>
                  <div className='row justify-content-center align-items-center'>
                    <h1>Loading...</h1>
                  </div>
                  <div className='row justify-content-center align-items-center'>
                    <p>This is a free Herku App so it might be waking up
                      <br/> Sorry for the wait!</p>
                    <img src={cat} alt='sleepy cat' />
                  </div>
                </div>;
            }
        } else {
            if (this.state.signupPage) {
                screen =
                <Signup
                  handleSignup={ this.handleSignup }
                  handleSignupPage={ this.handleSignupPage }
                />;
            } else {
                screen =
                <Login
                  handleLogin={ this.handleLogin }
                  handleSignupPage={ this.handleSignupPage }
                />;
            }
        }

        return (
          <div>
            <SiteNav
              loggedIn={ this.state.loggedIn }
              signupPage={ this.state.signupPage }
              accountPage= {this.state.accountPage }
              handleLogout={ this.handleLogout }
              handleSignupPage={ this.handleSignupPage }
              handleAccountPage={ this.handleAccountPage }
              handleQuotePage={ this.handleQuotePage }
            />
            <div className='container'>
              { message }
              { screen }
            </div>
          </div>
        );
    }
}

export default StockSite;
