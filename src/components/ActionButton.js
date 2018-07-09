import React, { Component } from 'react';
import { Button } from 'reactstrap';


class ActionButton extends Component {
  render() {
    return (
      <Button
        size="sm"
        color="danger"
        onClick={e => this.props.handleClick(e, this.props.stockID)}
        >
        {this.props.action}
      </Button>
    );
  }
}

export default ActionButton;
