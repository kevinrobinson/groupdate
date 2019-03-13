import React, { useRef, useState, useEffect, Component } from 'react';
import PropTypes from 'prop-types';
import Trainer from './training/Trainer';
import TappableButton from './components/TappableButton';
import YourOwnSearch from './YourOwnSearch';
import waitingGif from './waiting.gif';
import doneGif from './troy_happy.gif';
import './Training.css';

export default class Training extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTraining: false,
      isReadyToPredict: false,
      predictions: []
    };
    this.imgEls = {};
    this.trainer = new Trainer();

    this.onTrain = this.onTrain.bind(this);
    this.onPredictionMade = this.onPredictionMade.bind(this);
    this.onShare = this.onShare.bind(this);
  }

  componentWillUnmount(){
    this.imgEls = undefined;
    this.trainer = undefined;
  }

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

    this.setState({isReadyToPredict: true, isTraining: false});
  }

  onPredictionMade(payload) {
    const predictions = this.state.predictions.concat(payload);
    this.setState({predictions});
  }

  onShare() {
    const {modelText} = this.props;
    const {predictions} = this.state;
    console.log('share', JSON.stringify({modelText, predictions}));
  }

  render() {
    return (
      <div className="Training">
        {this.renderScreen()}
        {this.renderImages()}
      </div>
    );
  }

  renderScreen() {
    const {isReadyToPredict, isTraining} = this.state;
    if (!isReadyToPredict && !isTraining) return this.renderTrainButton();
    if (!isReadyToPredict && isTraining) return this.renderWaitWhileTraining();
    if (isReadyToPredict && !isTraining) return this.renderPredictions();
    if (isReadyToPredict && isTraining) return <pre>there was an error!</pre>;
  }

  renderImages() {
    const {labels} = this.props;
    return (
      <div style={{opacity: 0, marginTop: 400, width: '100%'}}> {/* hacking */}
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
                alt={card.text} />
              <div style={{background: '#333', color: 'white', padding: 10}}>{rating === 1 ? 'yes' : 'no'}</div>
            </div>
          );
        })}
      </div>
    );
  }

  renderTrainButton() {
    const {modelEl} = this.props;
    return (
      <div>
        <div className="Global-title">{`Okay, let's train your model!`}</div>
        <div className="Training-model-text">{modelEl}</div>
        <TappableButton onClick={this.onTrain}>{`Start the training`}</TappableButton>
      </div>
    );
  }

  renderWaitWhileTraining() {
    const {modelEl} = this.props;
    return (
      <div>
        <div className="Global-title">Training {modelEl}, just gotta wait...</div>
        <img src={waitingGif} style={{marginBottom: 20}} alt="waiting..." width="100%" />
        <div>Training involves feeding the model the pictures you labeled, seeing how wrong it is, then adjusting the numeric weights in the model to reduce the error.</div>
        <br />
        <div>This means multiplying and adding lots of numbers.</div>
      </div>
    );
  }

  renderPredictions() {
    const {modelEl} = this.props;
    const {predictions} = this.state;
    return (
      <div>
        <img src={doneGif} style={{marginBottom: 20}} alt="done!" width="100%" />
        <div className="Global-title">Now explore what {modelEl} thinks!</div>
        <YourOwnSearch
          renderImage={item => (
            <ImageWithPrediction
              item={item}
              asyncPredictFn={imgEl => this.trainer.predict(imgEl)}
              onPredictionMade={this.onPredictionMade}
            />
          )}
        />
        {predictions.length > 0 && (
          <div>
            <div className="Global-title">Share your {modelEl} and see how it compares to other models!</div>
            <TappableButton onClick={this.onShare}>{`Share`}</TappableButton>
          </div>
        )}
      </div>
    );
  }
}
Training.propTypes = {
  modelText: PropTypes.string.isRequired,
  modelEl: PropTypes.node.isRequired,
  labels: PropTypes.array.isRequired
};



function ImageWithPrediction({item, asyncPredictFn, onPredictionMade}) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const imgRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hasLoaded && imgRef) {
      asyncPredictFn(imgRef.current)
        .then(p => {
          setPrediction(p);
          onPredictionMade({item, prediction: p});
        })
        .catch(setError);
    }
  }, [hasLoaded, imgRef]);

  return (
    <div className="ImageSearch-image" key={item.link}>
      <img
        ref={imgRef}
        onLoad={() => setHasLoaded(true)}
        crossOrigin="Anonymous"
        src={item.image.thumbnailLink} /* can't load full images, they don't all support CORS */
        alt={item.title}
        width={300}
        height={224}
      />
      <div className="ImageSearch-image-source">
        <span>from </span>
        <a className="ImageSearch-image-link" href={item.image.contextLink} target="_blank" rel="noopener noreferrer">{item.displayLink}</a>
      </div>
      <div>
        <span>prediction:</span>
        <span>{hasLoaded && imgRef && error && <pre>{JSON.stringify(error)}</pre>}</span>
        <span>{hasLoaded && imgRef && prediction !== null ? prediction : '...'}</span>
      </div>
    </div>
  );
}
ImageWithPrediction.propTypes = {
  item: PropTypes.object.isRequired,
  asyncPredictFn: PropTypes.func.isRequired,
  onPredictionMade: PropTypes.func.isRequired
};