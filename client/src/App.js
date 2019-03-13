import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import uuid from 'uuid';
import _ from 'lodash';
import MobileSimulator from './components/MobileSimulator.js';
import Join from './Join';
import Swiping from './Swiping';
import Training from './Training';
// import Predict from './Predict';
import Splash from './Splash';
import './App.css';
import gif from './waiting.gif';
import cards from './cards';

// The main entry point for the app, routing to different pages.
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: uuid.v4(),
      modelText: sampleModelText(),
      screenKey: 'splash',
      wordLimit: 10,
      groupCount: 5,
      code: null,
      myCard: null,
      cards: null,
      labels: []
    };
    this.renderScreen = this.renderScreen.bind(this);
    this.renderGroups = this.renderGroups.bind(this);
    this.renderGroupsFromUrl = this.renderGroupsFromUrl.bind(this);
    this.doStoreLabel = this.doStoreLabel.bind(this);
    this.onDoneSplash = this.onDoneSplash.bind(this);
    this.onDoneJoin = this.onDoneJoin.bind(this);
    this.onAddMore = this.onAddMore.bind(this);
    this.onDoneSwiping = this.onDoneSwiping.bind(this);
    this.onPostCardDone = this.onPostCardDone.bind(this);
    this.onPostCardError = this.onPostCardError.bind(this);
  }

  // Optimization to prefetch subsequent image
  componentDidMount() {
    const image = new Image();
    image.src = gif;
  }

  doStoreLabel(card, rating) {
    const labels = this.state.labels.concat({card, rating});
    this.setState({labels});
  }

  onDoneSplash() {
    this.setState({screenKey: 'join'});
  }

  onPostCardDone(json) {
    const {card} = json;
    this.setState({ myCard: card });
  }

  onPostCardError(err) {
    console.error('onPostCardError', err); // eslint-disable-line no-console
  }
  
  onDoneJoin({code}) {
    this.setState({code, screenKey: 'swiping' });
  }

  // onDoneWords() {
  //   this.setState({ screenKey: 'wait' });
  // }

  // onDoneWait(cards) {
  //   this.setState({cards, screenKey: 'groupings' });
  // }

  onAddMore() {
    this.setState({ screenKey: 'swiping' });
  }

  onDoneSwiping() {
    this.setState({ screenKey: 'groupings' });
  }

  render() {
    return (
      <MobileSimulator minWidth={800} minHeight={400}>
        <BrowserRouter>
          <div className="App">
            <Route exact path="/" render={this.renderScreen} />
            <Route exact path="/groups/:code" render={this.renderGroupsFromUrl} />
          </div>
        </BrowserRouter>
      </MobileSimulator>
    );
  }

  renderScreen(props) {
    const {
      screenKey,
      code,
      modelText,
      labels
      // wordLimit,
    } = this.state;

    const modelEl = renderModelEl(modelText);
    // const testML = true;
    // if (testML) {
    //   return <Predict />;
    // }

    if (screenKey === 'splash') {
      return <Splash onNext={this.onDoneSplash} />;
    }

    if (screenKey === 'join') {
      return <Join modelEl={modelEl} onNext={this.onDoneJoin} />;
    }

    // if (screenKey === 'words') {
    //   return (
    //     <Words
    //       code={code}
    //       limit={wordLimit}
    //       doPostCard={this.doPostCard}
    //       onNext={this.onDoneWords} />
    //   );
    // }


    if (screenKey === 'swiping') {
      return (
        <Swiping
          modelEl={modelEl}
          code={code}
          cards={cards()}
          doStoreLabel={this.doStoreLabel}
          onNext={this.onDoneSwiping} />
      );
    }

    if (screenKey === 'groupings') {
      return this.renderGroups(code, labels);
    }

    return <div>not yet...</div>;
  }

  renderGroupsFromUrl(props) {
    const {code} = props.match.params;
    const testCards = cards();
    const labels = [
      { card: testCards[0], rating: 1 },
      { card: testCards[1], rating: 0 },
      { card: testCards[2], rating: 1 }
    ];
    return this.renderGroups(code, labels);
  }

  renderGroups(code, labels) {
    const {groupCount, modelText} = this.state;
    return (
      <Training
        modelText={modelText}
        modelEl={renderModelEl(modelText)}
        labels={labels}
        code={code}
        groupCount={groupCount}
      />
    );
  }
}

export default App;

const COLORS = 'orange blue red purple green brown'.split(' ');
const EMOTIONS = 'shocked inspired determined foolish amazed envious happy excited jubilant sassy nervous silly hopeful eager foolish'.split(' ');
const ANIMALS = 'beaver wombat crow ferret platypus walrus dinosaur gopher otter kraken grizzly penguin panda hedgehog lemur leopard'.split(' ');
// const NUMBERS = 'one two three four five six seven eight nine ten'.split(' ');
// const LETTERS = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ');
function sampleModelText() {
  return [
    _.sample(COLORS),
    _.sample(EMOTIONS),
    _.sample(ANIMALS)
  ].join('-');
}

function renderModelEl(modelText) {
  return <span style={{color: modelText.split('-')[0]}}>{modelText}</span>;
}