import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';


function ChartButtons(props) {
    const active = "btn btn-outline-light m-1";
    const inactive = "btn btn-outline-secondary m-1";
    //className={this.props.balanceRange === '1d' ? balActive : balInactive}
    return (
      <div className='mx-auto'>
        <button
          className={ props.balanceRange === '1d' ? active : inactive}
          onClick={ e => props.handleRangeChange(e, '1d') }>
          1D
        </button>
        <button
          className={ props.balanceRange === '1m' ? active : inactive}
          onClick={ e => props.handleRangeChange(e, '1m') }>
          1M
        </button>
        <button
          className={ props.balanceRange === '3m' ? active : inactive}
          onClick={ e => props.handleRangeChange(e, '3m') }>
          3M
        </button>
        <button
          className={ props.balanceRange === '6m' ? active : inactive}
          onClick={ e => props.handleRangeChange(e, '6m') }>
          6M
        </button>
        <button
          className={ props.balanceRange === '1y' ? active : inactive}
          onClick={ e => props.handleRangeChange(e, '1y') }>
          1Y
        </button>
        <button
          className={ props.balanceRange === '5y' ? active : inactive}
          onClick={ e => props.handleRangeChange(e, '5y') }>
          5Y
        </button>
      </div>
    );
}

class Chart extends Component {
    render() {
        var chartLabels = [];
        var chartPrices = [];
        if (this.props.chartData !== null) {
            this.props.chartData.forEach((data) => {
                if (data.close) {
                    chartPrices.push(data.close);
                    chartLabels.push(data.label);
                } else if (data.marketAverage !== -1) {
                    chartPrices.push(data.marketAverage);
                    chartLabels.push(data.label);
                }
            });
        }
        var firstPrice = chartPrices[0]
        var lastPrice = chartPrices[chartPrices.length - 1]
        var backgroundColor = firstPrice < lastPrice ? 'rgb(102, 255, 153)' : 'rgb(255, 51, 51)';
        const chartData = {
            labels: chartLabels,
            datasets: [{
                data: chartPrices
            }]
        };
        return (
          <div className='w-100 border border-white rounded bg-dark mb-2'>
              <Line
                data={ chartData }
              	options={{
                  elements: {
                    point: {
                      radius: 0,
                    },
                    line: {
                      fill: false,
                      borderColor: backgroundColor,
                      tension: 0.01,
                    },
                  },
                  maintainAspectRatio: true,
                  legend: {
                    display: false,
                  },
                  tooltips: {
                    mode: 'index',
                    intersect: false,
                  },
                  hover: {
                    mode: 'nearest',
                    intersect: true
                  },
                  scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: true,
                      },
                      gridLines: {
                        color: 'rgb(255, 255, 255)',
                        drawBorder: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                      },
                      ticks: {
                        callback: function(value, index, values) {
                          if (values.length > 150) {
                            // Hide the label of every 2nd dataset. return null to hide the grid line too
            								return index % 2 === 0 ? value : '';
                          } else {
                            return value;
                          }
          							},
                        fontColor: '#fff',
                        display: true,
                      }
                    }],
                    xAxes: [{
                      offset: true,
                      gridLines: {
                        color: 'rgb(255, 255, 255)',
                        drawBorder: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                      },
                      ticks: {
                        callback: function(value, index, values) {
                          if (values.length > 150) {
                            // Hide the label of every 2nd dataset. return null to hide the grid line too
            								return index % 2 === 0 ? value : '';
                          } else {
                            return value;
                          }
          							},
                        display: true,
                        fontColor: '#fff',
                      }
                    }]
                  }
                }}
              />
              <ChartButtons
                balanceRange={ this.props.balanceRange }
                handleRangeChange={ this.props.handleRangeChange }
              />
          </div>
        );
    }
}

export default Chart;
