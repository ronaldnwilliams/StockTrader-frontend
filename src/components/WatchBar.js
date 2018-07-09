
// class WatchBar extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             watchSymbol: ''
//         };
//     }
//
//     handleChange = e => {
//         const name = e.target.name;
//         const value = e.target.value;
//         this.setState(prevstate => {
//             const newState = {...prevstate };
//             newState[name] = value;
//             return newState;
//         });
//     }
//
//     render() {
//         return (
//           <form onSubmit={e => this.props.handleWatchBar(e, this.state.watchSymbol)}>
//             <input
//               type="text"
//               name="watchSymbol"
//               placeholder="symbol"
//               value={ this.state.watchSymbol }
//               onChange={ this.handleChange }
//             />
//             <input
//               type="submit"
//               value="Add"
//             />
//           </form>
//         );
//     }
// }
