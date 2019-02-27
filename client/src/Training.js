import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Trainer from './training/Trainer';
import raincoatDog from './img/charles-716555-unsplash-resized.jpg';
import ImageSearch from './search/ImageSearch';


class Training extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTraining: false,
      isReadyToPredict: false,
      query: 'dogs'
    };
    this.imgEls = {};
    this.trainer = new Trainer();

    this.onTrain = this.onTrain.bind(this);
    this.onQueryChange = this.onQueryChange.bind(this);
  }

  componentWillUnmount(){
    this.imgEls = undefined;
    this.trainer = undefined;
  }

  // prefetchImages() {
  //   const {labels} = this.props;
  //   labels.forEach(label => new Image().src = label.card.src);
  // }
  
  async onTrain() {
    this.setState({isTraining: true});

    const {labels} = this.props;
    await this.trainer.init();

    console.log('adding examples..');
    labels.forEach(label => {
      const {card, rating} = label;
      const imgEl = this.imgEls[card.id];
      if (!imgEl) return;
      
      this.trainer.addExample(imgEl, rating);
    });
    console.log('examples added!');

    console.log('training...');
    const history = await this.trainer.train();
    console.log('trained!');
    console.log('history', history);

    // console.log('predicting...');
    // const prediction = await this.trainer.predict(this.raincoatImgEl);
    // console.log('prediction for raincoatImgEl:', prediction);

    this.setState({isReadyToPredict: true, isTraining: false});
  }

  onQueryChange(e) {
    const query = e.target.value;
    this.setState({query});
  }

  render() {
    const {modelEl, labels} = this.props;
    const {isReadyToPredict} = this.state;
    return (
      <div className="Training">
        <div>model:</div>
        <div>{modelEl}</div>
        <br />
        <div>labels:</div>
        {labels.map(label => {
          const {card, rating} = label;
          return (
            <div key={card.id}>
              <img
                crossOrigin="Anonymous"
                ref={el => this.imgEls[card.id] = el}
                src={card.src}
                width={300}
                height={224}
                // width="100%"
                // height="auto"
                alt={card.text} />
              <div style={{background: '#333', color: 'white', padding: 10}}>{rating === 1 ? 'yes' : 'no'}</div>
            </div>
          );
        })}
        <br />
        
        {!isReadyToPredict
          ? this.renderTraining()
          : this.renderPredictions()}
      </div>
    );
  }

  renderTraining() {
    const {isTraining} = this.state;
    return (
      <div>
        <div>training:</div>
        {isTraining ? 'feeding the model examples and labels, adjusting the model to reduce the error, and repeating...' : <button onClick={this.onTrain}>train!</button>}
        <br />
      </div>
    );
  }

  renderPredictions() {
    const {query} = this.state;
    return (
      <div>
        <div>predictions:</div>
        <img
          crossOrigin="Anonymous"
          ref={el => this.raincoatImgEl = el}
          width={300}
          height={224}
          alt="raincoat dog"
          src={raincoatDog}
        />
        <div>Try your model out with more images!</div>
        <input
          autoFocus={true}
          onChange={this.onQueryChange}
          type="text"
          value={query}
        />
        <ImageSearch
          apiKey="abc"
          domain="https://services-edu.herokuapp.com"
          query={query}
          imageProps={{
            width: 300,
            height: 224
          }}
          asyncPredictFn={async (imgEl) => this.trainer.predict(imgEl)}
        />
      </div>
    );
  }
}
Training.propTypes = {
  modelEl: PropTypes.node.isRequired,
  labels: PropTypes.array.isRequired
};


export default Training;
