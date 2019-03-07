import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  state = {
    currentNode: null,
    prompt: false,
    text: null,
    difference: null,
    newGame: null,
    updatedURLString: "",
    allTrees: null
  };

  // componentDidMount() {
  //   if (!this.state.allTrees) {
  //     axios
  //       .get("https://binary-tree-list.firebaseio.com.json")
  //       .then(response => {
  //         console.log(response);
  //         this.setState({ allTrees: response });
  //       })
  //       .catch(error => {
  //         this.setState({ error: true });
  //       });
  //   }
  // }

  yes = () => {
    if (this.state.text === "Want to play again?") {
      this.start();
    } else if (this.state.currentNode.right == null) {
      this.setState({ text: "" });
      this.updateText("Want to play again?", 0);
    } else {
      let newText = null;
      let cn = { ...this.state.currentNode };
      if (cn.right.right) {
        newText = cn.right.data;
      } else {
        newText = `Is your game ${cn.right.data}?`;
      }
      this.setState({
        currentNode: cn.right,
        updatedURLString: this.state.updatedURLString + "/right"
      });
      this.updateText(newText, 0);
    }
  };

  no = () => {
    if (this.state.text === "Want to play again?") {
      this.setState({
        text: null
      });
    } else if (this.state.currentNode.right == null) {
      this.setState({
        response: null,
        prompt: true
      });
      this.updateText(`What game were you thinking off?`, 0);
    } else {
      let newText = null;
      let cn = { ...this.state.currentNode };
      if (cn.left.right) {
        newText = cn.left.data;
      } else {
        newText = `Is your game ${cn.left.data}?`;
      }
      this.setState({
        currentNode: cn.left,
        updatedURLString: this.state.updatedURLString + "/left"
      });
      this.updateText(newText, 0);
    }
  };

  registeringNewNode = () => {
    const newNode = {
      data: `Is your game a ${this.state.difference}?`,
      left: { ...this.state.currentNode },
      right: {
        data: this.state.newGame
      }
    };
    console.log(
      "https://binary-tree-list.firebaseio.com/tree" +
        this.state.updatedURLString +
        ".json"
    );
    axios
      .put(
        "https://binary-tree-list.firebaseio.com/tree" +
          this.state.updatedURLString +
          ".json",
        newNode
      )
      .then(response => {
        console.log("added succ", response);
      })
      .catch(e => {
        console.log("error", e);
      });
  };

  handleChange = e => {
    if (this.state.text === "What game were you thinking off?") {
      this.setState({ newGame: e.target.value });
    } else if (
      this.state.text ===
      "What type of game is the game that you thought of?: It's a..."
    ) {
      this.setState({ difference: e.target.value });
    }
  };

  next = () => {
    if (this.state.text === "What game were you thinking off?") {
      this.updateText(
        `What type of game is the game that you thought of?: It's a...`,
        0
      );
    } else if (
      this.state.text ===
      "What type of game is the game that you thought of?: It's a..."
    ) {
      this.registeringNewNode();
      this.yes();
      this.setState({
        prompt: false
      });
    }
  };

  start = () => {
    axios
      .get("https://binary-tree-list.firebaseio.com/tree.json")
      .then(response => {
        this.setState({
          currentNode: response.data,
          text: "",
          updatedURLString: ""
        });
        this.updateText(response.data.data, 0);
      })
      .catch(error => {
        console.log(error);
      });
  };

  updateText = (newText, pos) => {
    if (newText !== this.state.text) {
      console.log(this.state.text.length, newText);
      let updatedText = newText.substring(0, pos);
      this.setState({
        text: updatedText
      });
      setTimeout(
        function() {
          this.updateText(newText, pos + 1);
        }.bind(this),
        50
      );
    }
  };

  render() {
    // let startButtons = null;

    // if (this.state.allTrees) {
    //   let keys = [];
    //   for (let key in this.state.allTrees) {
    //     keys.push(key);
    //   }
    //   console.log(keys);
    //   startButtons = keys.map(key => <button>{key}</button>);
    // }

    return (
      <div>
        {this.state.text ? (
          this.state.text
        ) : (
          <button onClick={this.start}>Play</button>
        )}

        {this.state.prompt ? (
          <div>
            <input onChange={this.handleChange} />
            <button onClick={this.next}>Enter</button>
          </div>
        ) : null}
        {!this.state.prompt && this.state.text ? (
          <div>
            <button onClick={this.no}>No</button>
            <button onClick={this.yes}>Yes</button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default App;
