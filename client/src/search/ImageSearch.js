import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import qs from 'query-string';
import './ImageSearch.css';

export default class ImageSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      json: null,
      predictionsMap: {},
      imagesLoadedMap: {}
    };

    this.imgEls = {};
    this.onFetchDone = this.onFetchDone.bind(this);
    this.onFetchError = this.onFetchError.bind(this);
    this.debouncedFetch = _.debounce(this.debouncedFetch, 100);
  }

  componentDidMount() {
    console.log('componentDidMount', this.props);
    this.debouncedFetch();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.query !== prevProps.query) {
      this.debouncedFetch();
    }

    const dataHasChanged = (
      !_.isEqual(this.state.json, prevState.json) ||
      !_.isEqual(this.state.predictionsMap, prevState.predictionsMap) ||
      !_.isEqual(this.state.imagesLoadedMap, prevState.imagesLoadedMap)
    );
    if (dataHasChanged) {
      this.updatePredictions();
    }
  }

  componentWillUnmount(){
    this.imgEls = undefined;
  }

  apiKey() {
    return this.props.apiKey || readApiKeyFromWindow();
  }

  async updatePredictions() {
    const {asyncPredictFn} = this.props;
    if (!asyncPredictFn) {
      console.log('no asyncPredictFn...');
      return;
    }

    // console.log('imagesLoadedMap', JSON.stringify(imagesLoadedMap, null, 2));
    const {imagesLoadedMap} = this.state;
    const items = (this.state.json && this.state.json.items) || [];
    const predictions = await Promise.all(items.map(item => {
      const imgEl = this.imgEls[item.link];
      const isImageLoaded = imagesLoadedMap[item.link];
      return (isImageLoaded) ? asyncPredictFn(imgEl) : null;
    }));
    var predictionsMap = {};
    items.forEach((item, index) => predictionsMap[item.link] = predictions[index]);
    // console.log('predictionsMap', JSON.stringify(predictionsMap, null, 2));
    this.setState({predictionsMap});
  }

  debouncedFetch() {
    const {domain, query} = this.props;
    const headers = {'X-Services-Edu-Api-Key': this.apiKey()};
    const url = `${domain || readDomainFromEnv()}/images/search?q=${query}`;
    fetch(url, {headers})
      .then(response => response.json())
      .then(this.onFetchDone)
      .catch(this.onFetchError);
  }

  onFetchDone(json) {
    this.setState({json});
  }

  onFetchError(error) {
    this.setState({error});
  }

  onImageLoaded(link) {
    const {imagesLoadedMap} = this.state;
    console.log('onImageLoaded', link, imagesLoadedMap);
    this.setState({
      imagesLoadedMap: {
        ...imagesLoadedMap,
        [link]: true
      }
    });
  }
  render() {
    return (
      <div className="ImageSearch">
        <header className="ImageSearch-header">
          {!this.apiKey() ? this.renderMissingApiKey() : this.renderSearch()}
        </header>
      </div>
    );
  }

  renderMissingApiKey() {
    return (
      <div>
        <div>You need an API key to get started.</div>
        <div>When you get one, add it to the URL like `/images?api_key=abc`</div>
      </div>
    );
  }

  renderSearch() {
    const {error, json} = this.state;
    return (
      <div>
        {json && this.renderJson(json.items || [])}
        {error && <div>error: {JSON.stringify(error, null, 2)}</div>}
      </div>
    );
  }

  renderJson(items) {
    const {imageProps} = this.props;
    return (
      <div>
        {items.map(item => (
          <div className="ImageSearch-image" key={item.link}>
            <img
              crossOrigin="Anonymous"
              ref={el => this.imgEls[item.link] = el}
              onLoad={this.onImageLoaded.bind(this, item.link)}
              src={item.image.thumbnailLink} /* can't load full images, they don't all support CORS */
              alt={item.title}
              {...imageProps}
            />
            <div className="ImageSearch-image-source">
              <span>from </span>
              <a className="ImageSearch-image-link" href={item.image.contextLink} target="_blank" rel="noopener noreferrer">{item.displayLink}</a>
            </div>
            <div>
              <span>prediction: </span>
              <div>{this.renderPredictionFor(item)}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  renderPredictionFor(item) {
    const {predictionsMap} = this.state;
    const predictionValue = (predictionsMap || {})[item.link];
    return (predictionValue === null) ? '...' : predictionValue;
  }
}
ImageSearch.propTypes = {
  query: PropTypes.string.isRequired,
  asyncPredictFn: PropTypes.func.isRequired,
  imageProps: PropTypes.object,
  domain: PropTypes.string,
  apiKey: PropTypes.string
};

export function readApiKeyFromWindow() {
  const queryString = qs.parse(window.location.search);
  return queryString.api_key;
}


function readDomainFromEnv() {
  return window.process.env.REACT_APP_DOMAIN || 'http://localhost:5000';
}

// doesn't work, "Tainted canvases may not be loaded."
// see https://mdn.beonex.com/en/CORS_Enabled_Image.html
// even with CORS header from server, need to use crossOrigin on image el
// function copyImgElToCanvasEl(imgEl) {
//   const canvas = document.createElement('canvas');
//   const context = canvas.getContext('2d');
//   context.drawImage(imgEl, imgEl.width, imgEl.height);
//   return canvas;
// }